'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChartConfig } from '@/lib/types/analytics';
import { FIELD_TYPES, formatDate, isValidNumericValue, parseConfig, sortByFieldType } from '@/lib/utils/analytics';
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { AnalyticVisualizationProps } from '../../registry';

export const LineChartVisualization = ({
  analytic,
  recordFields,
  recordItems,
}: AnalyticVisualizationProps) => {
  const config = useMemo<LineChartConfig>(() => {
    return parseConfig<LineChartConfig>(analytic.configuration, { configVersion: 1, xAxisFieldId: '', yAxisFieldId: '' });
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
        return xValue && isValidNumericValue(yValue);
      })
      .map(item => {
        const xValue = item[config.xAxisFieldId];
        const yValue = parseFloat(item[config.yAxisFieldId]);

        // Format X-axis value based on field type
        const formattedX = xAxisField.fieldType === FIELD_TYPES.DATE 
          ? formatDate(xValue) 
          : xValue;

        return {
          [xAxisField.name]: formattedX,
          [yAxisField.name]: yValue,
          // Keep original for sorting
          _sortKey: xValue,
        };
      });

    return sortByFieldType(validItems, xAxisField.fieldType);

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
            dot={{ fill: 'var(--color-chart-2)' }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

