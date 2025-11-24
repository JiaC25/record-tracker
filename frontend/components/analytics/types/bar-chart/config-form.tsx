'use client';

import { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalyticConfigFormProps } from '../../registry';
import { BarChartConfig, GroupByPeriod, AggregationType } from '@/lib/types/analytics';
import { filterFieldsByType, filterFieldsByTypes, isFieldType, parseConfig, X_AXIS_FIELD_TYPES, FIELD_TYPES } from '@/lib/utils/analytics';

export const BarChartConfigForm = ({
    recordFields,
    initialConfig,
    onConfigChange,
    onValidationChange,
}: AnalyticConfigFormProps) => {
    const [xAxisFieldId, setXAxisFieldId] = useState<string>('');
    const [xAxisGroupByPeriod, setXAxisGroupByPeriod] = useState<GroupByPeriod | null>(null);
    const [yAxisAggregation, setYAxisAggregation] = useState<AggregationType>('count');
    const [yAxisFieldId, setYAxisFieldId] = useState<string>('');
    const [chartOrientation, setChartOrientation] = useState<'vertical' | 'horizontal'>('vertical');
    const isInitialLoad = useRef(true);

    const xAxisFields = filterFieldsByTypes(recordFields, X_AXIS_FIELD_TYPES);
    const numberFields = filterFieldsByType(recordFields, FIELD_TYPES.NUMBER);
    const dateFields = filterFieldsByType(recordFields, FIELD_TYPES.DATE);

    const selectedXAxisField = recordFields.find(f => f.id === xAxisFieldId);
    const isXAxisDate = isFieldType(selectedXAxisField, FIELD_TYPES.DATE);

    useEffect(() => {
        if (initialConfig) {
            const defaultConfig: BarChartConfig = {
                configVersion: 1,
                xAxisFieldId: '',
                yAxisAggregation: 'count',
                chartOrientation: 'vertical',
            };
            const config = parseConfig<BarChartConfig>(initialConfig, defaultConfig);
            isInitialLoad.current = true;
            setXAxisFieldId(config.xAxisFieldId || '');
            setXAxisGroupByPeriod(config.xAxisGroupByPeriod ?? null);
            setYAxisAggregation(config.yAxisAggregation || 'count');
            setYAxisFieldId(config.yAxisFieldId || '');
            setChartOrientation(config.chartOrientation || 'vertical');
            setTimeout(() => {
                isInitialLoad.current = false;
            }, 0);
        } else {
            isInitialLoad.current = false;
            setXAxisFieldId('');
            setXAxisGroupByPeriod(null);
            setYAxisAggregation('count');
            setYAxisFieldId('');
            setChartOrientation('vertical');
        }
    }, [initialConfig]);

    // Reset period grouping if X-axis is not Date (but only after X-axis is set and field type is determined)
    // Skip this during initial load to avoid clearing values from saved config
    useEffect(() => {
        if (isInitialLoad.current || !xAxisFieldId) return;
        
        const field = recordFields.find(f => f.id === xAxisFieldId);
        if (field && !isFieldType(field, FIELD_TYPES.DATE) && xAxisGroupByPeriod !== null) {
            setXAxisGroupByPeriod(null);
        }
    }, [xAxisFieldId, recordFields, xAxisGroupByPeriod]);

    // Reset Y-axis field if aggregation is count (but only after aggregation is set)
    useEffect(() => {
        if (yAxisAggregation === 'count' && yAxisFieldId) {
            setYAxisFieldId('');
        }
    }, [yAxisAggregation, yAxisFieldId]);

    useEffect(() => {
        const isValid = !!xAxisFieldId && xAxisFields.some(f => f.id === xAxisFieldId) &&
            (yAxisAggregation === 'count' || (!!yAxisFieldId && numberFields.some(f => f.id === yAxisFieldId)));
        onValidationChange(isValid);

        if (isValid) {
            const config: BarChartConfig = {
                configVersion: 1,
                xAxisFieldId,
                xAxisGroupByPeriod: isXAxisDate && xAxisGroupByPeriod ? xAxisGroupByPeriod : undefined,
                yAxisAggregation,
                yAxisFieldId: yAxisAggregation !== 'count' && yAxisFieldId ? yAxisFieldId : undefined,
                chartOrientation,
            };
            onConfigChange(JSON.stringify(config));
        }
    }, [xAxisFieldId, xAxisGroupByPeriod, yAxisAggregation, yAxisFieldId, chartOrientation, xAxisFields, numberFields, isXAxisDate, onConfigChange, onValidationChange]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">X-Axis</span>
                <Select value={xAxisFieldId} onValueChange={setXAxisFieldId}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                        {xAxisFields.map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                                {field.name} ({field.fieldType})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {isXAxisDate && (
                    <>
                        <span className="text-sm">group by</span>
                        <Select 
                            value={xAxisGroupByPeriod || undefined} 
                            onValueChange={(value) => setXAxisGroupByPeriod(value as GroupByPeriod)}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Period" />
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

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">Y-Axis</span>
                <Select value={yAxisAggregation} onValueChange={(value) => setYAxisAggregation(value as typeof yAxisAggregation)}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Aggregation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="sum">Sum</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="max">Maximum</SelectItem>
                        <SelectItem value="min">Minimum</SelectItem>
                    </SelectContent>
                </Select>
                {yAxisAggregation !== 'count' && (
                    <>
                        <span className="text-sm">of</span>
                        <Select value={yAxisFieldId} onValueChange={setYAxisFieldId}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select number field" />
                            </SelectTrigger>
                            <SelectContent>
                                {numberFields.map((field) => (
                                    <SelectItem key={field.id} value={field.id}>
                                        {field.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">Chart Orientation</span>
                <Select value={chartOrientation} onValueChange={(value) => setChartOrientation(value as 'vertical' | 'horizontal')}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Orientation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

