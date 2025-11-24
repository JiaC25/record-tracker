'use client';

import { AnalyticVisualizationProps } from '../../registry';
import { AggregateValueConfig, AggregateFunction } from '@/lib/types/analytics';
import { useMemo } from 'react';
import { Dot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const AggregateValueVisualization = ({
    analytic,
    recordFields,
    recordItems,
}: AnalyticVisualizationProps) => {
    const config = useMemo<AggregateValueConfig>(() => {
        try {
            return JSON.parse(analytic.configuration);
        } catch {
            return { configVersion: 1, aggregationFunction: 'average' as AggregateFunction, valueFieldId: '' };
        }
    }, [analytic.configuration]);

    const valueField = recordFields.find(f => f.id === config.valueFieldId);
    const groupByField = config.groupByFieldId 
        ? recordFields.find(f => f.id === config.groupByFieldId)
        : null;

    const getFunctionLabel = (func: AggregateFunction) => {
        switch (func) {
            case 'average': return 'Average';
            case 'max': return 'Maximum';
            case 'min': return 'Minimum';
            case 'sum': return 'Sum';
            default: return func;
        }
    };

    const calculateAggregate = (values: number[], func: AggregateFunction): number => {
        if (values.length === 0) return 0;
        switch (func) {
            case 'average':
                return values.reduce((acc, val) => acc + val, 0) / values.length;
            case 'max':
                return Math.max(...values);
            case 'min':
                return Math.min(...values);
            case 'sum':
                return values.reduce((acc, val) => acc + val, 0);
            default:
                return 0;
        }
    };

    const result = useMemo(() => {
        if (!valueField) return null;

        // Filter items that have the value field
        const validItems = recordItems.filter(item => {
            const value = item[config.valueFieldId];
            return value && value.trim() !== '' && !isNaN(parseFloat(value));
        });

        if (validItems.length === 0) return null;

        // If no grouping, or if function doesn't support grouping (max/min/sum), calculate overall aggregate
        const supportsGrouping = config.aggregationFunction === 'average';
        if (!groupByField || !config.groupByPeriod || !supportsGrouping) {
            const values = validItems.map(item => parseFloat(item[config.valueFieldId]));
            const aggregateValue = calculateAggregate(values, config.aggregationFunction);
            return {
                value: aggregateValue,
                count: validItems.length,
                grouped: false,
            };
        }

        // Group by period
        const groups = new Map<string, number[]>();

        validItems.forEach(item => {
            const dateStr = item[config.groupByFieldId!];
            if (!dateStr) return;

            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return;

            let key: string;
            switch (config.groupByPeriod) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'year':
                    key = String(date.getFullYear());
                    break;
                default:
                    return;
            }

            const value = parseFloat(item[config.valueFieldId]);
            const existing = groups.get(key) || [];
            groups.set(key, [...existing, value]);
        });

        // Calculate aggregate for each group
        const groupAggregates = Array.from(groups.entries()).map(([key, values]) => ({
            period: key,
            aggregate: calculateAggregate(values, config.aggregationFunction),
            count: values.length,
        }));

        if (groupAggregates.length === 0) return null;

        // For grouped results:
        // - Average: average of group aggregates (average of monthly totals for average per month)
        // - Max/Min: max/min of group aggregates
        // - Sum: sum of group aggregates (total across all periods)
        let overallValue: number;
        if (config.aggregationFunction === 'average') {
            // Average of group totals (for average per month, we want average of monthly totals)
            const groupTotals = Array.from(groups.entries()).map(([_, values]) => 
                values.reduce((acc, val) => acc + val, 0)
            );
            overallValue = groupTotals.reduce((acc, total) => acc + total, 0) / groupTotals.length;
        } else if (config.aggregationFunction === 'sum') {
            // Sum of all values across all groups
            overallValue = groupAggregates.reduce((acc, g) => acc + g.aggregate, 0);
        } else {
            // Max/Min: max/min of group aggregates
            overallValue = calculateAggregate(
                groupAggregates.map(g => g.aggregate),
                config.aggregationFunction
            );
        }

        return {
            value: overallValue,
            count: validItems.length,
            grouped: true,
            groupCount: groupAggregates.length,
            period: config.groupByPeriod,
        };
    }, [config, valueField, groupByField, recordItems]);

    if (!valueField) {
        return (
            <div className="p-5 text-sm text-muted-foreground">
                Invalid configuration: value field not found
            </div>
        );
    }

    if (!result) {
        return (
            <div className="p-5 text-sm text-muted-foreground">
                No data available
            </div>
        );
    }

    const formatNumber = (num: number) => {
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const functionLabel = getFunctionLabel(config.aggregationFunction);
    const supportsGrouping = config.aggregationFunction === 'average';

    return (
        <div className="p-5">
            <div className="flex flex-col gap-0">
                <div className="text-sm text-muted-foreground mb-1">
                    {result.grouped && supportsGrouping
                        ? `${functionLabel} ${valueField.name} per ${config.groupByPeriod}`
                        : `${functionLabel} ${valueField.name}`
                    }
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-3xl font-semibold">
                        {formatNumber(result.value)}
                    </span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {result.count} {result.count === 1 ? 'entry' : 'entries'}
                    {result.grouped && supportsGrouping && <Dot size={16}/>}
                    {result.grouped && supportsGrouping && ` ${result.groupCount} ${config.groupByPeriod}${result.groupCount === 1 ? '' : 's'}`}
                </div>
            </div>
            <Separator orientation="vertical" className="h-5"/>
        </div>
    );
};

