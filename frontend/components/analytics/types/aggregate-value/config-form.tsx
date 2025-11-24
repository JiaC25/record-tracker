'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalyticConfigFormProps } from '../../registry';
import { AggregateValueConfig, AggregateFunction, GroupByPeriod } from '@/lib/types/analytics';

export const AggregateValueConfigForm = ({
    recordFields,
    initialConfig,
    onConfigChange,
    onValidationChange,
}: AnalyticConfigFormProps) => {
    const [aggregationFunction, setAggregationFunction] = useState<AggregateFunction>('average');
    const [valueFieldId, setValueFieldId] = useState<string>('');
    const [groupByFieldId, setGroupByFieldId] = useState<string>('__none__');
    const [groupByPeriod, setGroupByPeriod] = useState<GroupByPeriod | null>(null);

    const numberFields = recordFields.filter(f => f.fieldType === 'Number');
    const dateFields = recordFields.filter(f => f.fieldType === 'Date');

    useEffect(() => {
        if (initialConfig) {
            try {
                const config: AggregateValueConfig = JSON.parse(initialConfig);
                setAggregationFunction(config.aggregationFunction || 'average');
                setValueFieldId(config.valueFieldId || '');
                setGroupByFieldId(config.groupByFieldId || '__none__');
                setGroupByPeriod(config.groupByPeriod || null);
            } catch {
                // Invalid config, use defaults
            }
        }
    }, [initialConfig]);

    // Reset grouping when switching away from average
    useEffect(() => {
        if (aggregationFunction !== 'average') {
            setGroupByFieldId('__none__');
            setGroupByPeriod(null);
        }
    }, [aggregationFunction]);

    useEffect(() => {
        const isValid = !!valueFieldId && numberFields.some(f => f.id === valueFieldId);
        onValidationChange(isValid);

        if (isValid) {
            const config: AggregateValueConfig = {
                configVersion: 1,
                aggregationFunction,
                valueFieldId,
                // Only include grouping for average
                groupByFieldId: aggregationFunction === 'average' && groupByFieldId && groupByFieldId !== '__none__' ? groupByFieldId : undefined,
                groupByPeriod: aggregationFunction === 'average' && groupByPeriod ? groupByPeriod : undefined,
            };
            onConfigChange(JSON.stringify(config));
        }
    }, [aggregationFunction, valueFieldId, groupByFieldId, groupByPeriod, numberFields, onConfigChange, onValidationChange]);

    const getFunctionLabel = (func: AggregateFunction) => {
        switch (func) {
            case 'average': return 'Average';
            case 'max': return 'Maximum';
            case 'min': return 'Minimum';
            case 'sum': return 'Sum';
            default: return func;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">Calculate the</span>
                <Select value={aggregationFunction} onValueChange={(value) => setAggregationFunction(value as AggregateFunction)}>
                    <SelectTrigger className="w-[120px] mx-1">
                        <SelectValue placeholder="Select function" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="max">Maximum</SelectItem>
                        <SelectItem value="min">Minimum</SelectItem>
                        <SelectItem value="sum">Sum</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm">of</span>
                <Select value={valueFieldId} onValueChange={setValueFieldId}>
                    <SelectTrigger className="w-fit mx-1">
                        <SelectValue placeholder="Select a Number field" />
                    </SelectTrigger>
                    <SelectContent>
                        {numberFields.map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                                {field.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {dateFields.length > 0 && aggregationFunction === 'average' && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm">Group by</span>
                    <Select value={groupByFieldId} onValueChange={setGroupByFieldId}>
                        <SelectTrigger className="w-fit mx-1">
                            <SelectValue placeholder="None (overall average)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__none__">None</SelectItem>
                            {dateFields.map((field) => (
                                <SelectItem key={field.id} value={field.id}>
                                    {field.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {groupByFieldId && groupByFieldId !== '__none__' && (
                        <>
                            <span className="text-sm">per</span>
                            <Select 
                                value={groupByPeriod || undefined} 
                                onValueChange={(value) => setGroupByPeriod(value as GroupByPeriod | null)}
                            >
                                <SelectTrigger className="w-[120px] mx-1">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Day</SelectItem>
                                    <SelectItem value="week">Week</SelectItem>
                                    <SelectItem value="month">Month</SelectItem>
                                    <SelectItem value="year">Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

