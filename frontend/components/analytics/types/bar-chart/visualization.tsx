'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnalyticVisualizationProps } from '../../registry';
import { BarChartConfig } from '@/lib/types/analytics';
import { useMemo } from 'react';

export const BarChartVisualization = ({
    analytic,
    recordFields,
    recordItems,
}: AnalyticVisualizationProps) => {
    const config = useMemo<BarChartConfig>(() => {
        try {
            return JSON.parse(analytic.configuration);
        } catch {
            return { 
                configVersion: 1, 
                xAxisFieldId: '', 
                yAxisAggregation: 'count' as const,
                chartOrientation: 'vertical' as const
            };
        }
    }, [analytic.configuration]);

    const xAxisField = recordFields.find(f => f.id === config.xAxisFieldId);
    const yAxisField = config.yAxisFieldId ? recordFields.find(f => f.id === config.yAxisFieldId) : null;

    const chartData = useMemo(() => {
        if (!xAxisField) return [];

        const isXAxisDate = xAxisField.fieldType === 'Date';
        const groups = new Map<string, number[]>();

        // Group items by X-axis value
        recordItems.forEach(item => {
            const xValue = item[config.xAxisFieldId];
            if (!xValue) return;

            let groupKey: string;

            if (isXAxisDate && config.xAxisGroupByPeriod) {
                // Group by period
                const date = new Date(xValue);
                if (isNaN(date.getTime())) return;

                switch (config.xAxisGroupByPeriod) {
                    case 'day':
                        groupKey = date.toISOString().split('T')[0];
                        break;
                    case 'week':
                        const weekStart = new Date(date);
                        weekStart.setDate(date.getDate() - date.getDay());
                        groupKey = weekStart.toISOString().split('T')[0];
                        break;
                    case 'month':
                        groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        break;
                    case 'year':
                        groupKey = String(date.getFullYear());
                        break;
                    default:
                        groupKey = xValue;
                }
            } else {
                // Use value as-is
                groupKey = xValue;
            }

            // Get Y-axis value
            let yValue: number | null = null;
            if (config.yAxisAggregation === 'count') {
                yValue = 1; // Count each item as 1
            } else if (yAxisField) {
                const fieldValue = item[config.yAxisFieldId!];
                if (fieldValue && fieldValue.trim() !== '' && !isNaN(parseFloat(fieldValue))) {
                    yValue = parseFloat(fieldValue);
                }
            }

            if (yValue !== null) {
                const existing = groups.get(groupKey) || [];
                groups.set(groupKey, [...existing, yValue]);
            }
        });

        // Calculate aggregated values for each group
        const aggregatedData = Array.from(groups.entries()).map(([key, values]) => {
            let aggregated: number;
            switch (config.yAxisAggregation) {
                case 'count':
                    aggregated = values.length;
                    break;
                case 'sum':
                    aggregated = values.reduce((acc, val) => acc + val, 0);
                    break;
                case 'average':
                    aggregated = values.reduce((acc, val) => acc + val, 0) / values.length;
                    break;
                case 'max':
                    aggregated = Math.max(...values);
                    break;
                case 'min':
                    aggregated = Math.min(...values);
                    break;
                default:
                    aggregated = 0;
            }

            // Format the key for display
            let displayKey = key;
            if (isXAxisDate && config.xAxisGroupByPeriod) {
                // Format date-based keys
                if (config.xAxisGroupByPeriod === 'month' && key.match(/^\d{4}-\d{2}$/)) {
                    const [year, month] = key.split('-');
                    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                    displayKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                } else if (config.xAxisGroupByPeriod === 'year') {
                    displayKey = key;
                } else if (config.xAxisGroupByPeriod === 'day' || config.xAxisGroupByPeriod === 'week') {
                    const date = new Date(key);
                    if (!isNaN(date.getTime())) {
                        displayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                } else {
                    const date = new Date(key);
                    if (!isNaN(date.getTime())) {
                        displayKey = date.toLocaleDateString();
                    }
                }
            }

            return {
                [xAxisField.name]: displayKey,
                value: aggregated,
                _sortKey: key, // For sorting
            };
        });

        // Sort data
        if (isXAxisDate && config.xAxisGroupByPeriod) {
            aggregatedData.sort((a, b) => a._sortKey.localeCompare(b._sortKey));
        } else if (xAxisField.fieldType === 'Number') {
            aggregatedData.sort((a, b) => parseFloat(a._sortKey) - parseFloat(b._sortKey));
        } else {
            aggregatedData.sort((a, b) => a._sortKey.localeCompare(b._sortKey));
        }

        return aggregatedData;
    }, [config, xAxisField, yAxisField, recordItems]);

    if (!xAxisField) {
        return (
            <div className="p-5 text-sm text-muted-foreground">
                Invalid configuration: X-axis field not found
            </div>
        );
    }

    if (config.yAxisAggregation !== 'count' && !yAxisField) {
        return (
            <div className="p-5 text-sm text-muted-foreground">
                Invalid configuration: Y-axis field not found
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="p-5 text-sm text-muted-foreground">
                No data available
            </div>
        );
    }

    const getAggregationLabel = () => {
        switch (config.yAxisAggregation) {
            case 'count': return 'Count';
            case 'sum': return yAxisField ? `Sum of ${yAxisField.name}` : 'Sum';
            case 'average': return yAxisField ? `Average of ${yAxisField.name}` : 'Average';
            case 'max': return yAxisField ? `Maximum of ${yAxisField.name}` : 'Maximum';
            case 'min': return yAxisField ? `Minimum of ${yAxisField.name}` : 'Minimum';
            default: return 'Value';
        }
    };

    const chartConfig = {
        value: {
            label: getAggregationLabel(),
            color: 'var(--chart-1)',
        },
    };

    const isHorizontal = config.chartOrientation === 'horizontal';

    return (
        <ChartContainer config={chartConfig} className="w-full p-4">
            {isHorizontal ? (
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                        left: -15,
                    }}
                >
                    <XAxis 
                        type="number" 
                        dataKey="value" 
                        hide 
                    />
                    <YAxis
                        dataKey={xAxisField.name}
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        width={120}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar 
                        dataKey="value" 
                        fill="var(--color-value)" 
                        radius={5} 
                    />
                </BarChart>
            ) : (
                <BarChart
                    accessibilityLayer
                    data={chartData}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey={xAxisField.name}
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar 
                        dataKey="value" 
                        fill="var(--color-value)" 
                        radius={8} 
                    />
                </BarChart>
            )}
        </ChartContainer>
    );
};

