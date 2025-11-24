'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnalyticVisualizationProps } from '../../registry';
import { LineChartConfig } from '@/lib/types/analytics';
import { useMemo } from 'react';

export const LineChartVisualization = ({
    analytic,
    recordFields,
    recordItems,
}: AnalyticVisualizationProps) => {
    const config = useMemo<LineChartConfig>(() => {
        try {
            return JSON.parse(analytic.configuration);
        } catch {
            return { configVersion: 1, xAxisFieldId: '', yAxisFieldId: '' };
        }
    }, [analytic.configuration]);

    const xAxisField = recordFields.find(f => f.id === config.xAxisFieldId);
    const yAxisField = recordFields.find(f => f.id === config.yAxisFieldId);

    const chartData = useMemo(() => {
        if (!xAxisField || !yAxisField) return [];

        // Filter and process items
        const validItems = recordItems
            .filter(item => {
                const xValue = item[config.xAxisFieldId];
                const yValue = item[config.yAxisFieldId];
                return xValue && yValue && yValue.trim() !== '' && !isNaN(parseFloat(yValue));
            })
            .map(item => {
                const xValue = item[config.xAxisFieldId];
                const yValue = parseFloat(item[config.yAxisFieldId]);

                // Format X-axis value based on field type
                let formattedX: string;
                if (xAxisField.fieldType === 'Date') {
                    const date = new Date(xValue);
                    if (!isNaN(date.getTime())) {
                        formattedX = date.toLocaleDateString();
                    } else {
                        formattedX = xValue;
                    }
                } else {
                    formattedX = xValue;
                }

                return {
                    [xAxisField.name]: formattedX,
                    [yAxisField.name]: yValue,
                    // Keep original for sorting
                    _xValue: xValue,
                    _xType: xAxisField.fieldType,
                };
            })
            .sort((a, b) => {
                // Sort by X-axis value
                if (xAxisField.fieldType === 'Date') {
                    return new Date(a._xValue).getTime() - new Date(b._xValue).getTime();
                } else if (xAxisField.fieldType === 'Number') {
                    return parseFloat(a._xValue) - parseFloat(b._xValue);
                } else {
                    return a._xValue.localeCompare(b._xValue);
                }
            });

        return validItems;
    }, [config, xAxisField, yAxisField, recordItems]);

    if (!xAxisField || !yAxisField) {
        return (
            <div className="p-5 text-sm text-muted-foreground">
                Invalid configuration: X-axis or Y-axis field not found
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

    const chartConfig = {
        [yAxisField.name]: {
            label: yAxisField.name,
            color: 'var(--color-chart-1)',
        },
    };

    return (
        <div className="p-5">
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <LineChart data={chartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey={xAxisField.name}
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                        type="monotone"
                        dataKey={yAxisField.name}
                        stroke={`var(--color-${yAxisField.name})`}
                        strokeWidth={2}
                        dot={{ fill: "var(--color-chart-2)" }}
                    />
                </LineChart>
            </ChartContainer>
        </div>
    );
};

