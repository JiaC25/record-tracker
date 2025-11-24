'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChartConfig } from '@/lib/types/analytics';
import {
  calculateAggregate,
  FIELD_TYPES,
  formatDateGroupKey,
  getAggregationLabel,
  getDateGroupKey,
  parseConfig,
  parseNumericValue,
  sortByFieldType
} from '@/lib/utils/analytics';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { AnalyticVisualizationProps } from '../../registry';

export const BarChartVisualization = ({
  analytic,
  recordFields,
  recordItems,
}: AnalyticVisualizationProps) => {
  const defaultConfig: BarChartConfig = {
    configVersion: 1,
    xAxisFieldId: '',
    yAxisAggregation: 'count',
    chartOrientation: 'vertical',
  };

  const config = useMemo<BarChartConfig>(() => {
    return parseConfig<BarChartConfig>(analytic.configuration, defaultConfig);
  }, [analytic.configuration]);

  const xAxisField = recordFields.find((f) => f.id === config.xAxisFieldId);
  const yAxisField = config.yAxisFieldId
    ? recordFields.find((f) => f.id === config.yAxisFieldId)
    : null;

  const chartData = useMemo(() => {
    if (!xAxisField) return [];

    const isXAxisDate = xAxisField.fieldType === FIELD_TYPES.DATE;
    const groups = new Map<string, number[]>();

    // Group items by X-axis value
    recordItems.forEach((item) => {
      const xValue = item[config.xAxisFieldId];
      if (!xValue) return;

      let groupKey: string;

      if (isXAxisDate && config.xAxisGroupByPeriod) {
        const date = new Date(xValue);
        if (isNaN(date.getTime())) return;
        groupKey = getDateGroupKey(date, config.xAxisGroupByPeriod);
      } else {
        groupKey = xValue;
      }

      // Get Y-axis value
      let yValue: number | null = null;
      if (config.yAxisAggregation === 'count') {
        yValue = 1; // Count each item as 1
      } else if (yAxisField) {
        yValue = parseNumericValue(item[config.yAxisFieldId!]);
      }

      if (yValue !== null) {
        const existing = groups.get(groupKey) || [];
        groups.set(groupKey, [...existing, yValue]);
      }
    });

    // Calculate aggregated values for each group
    const aggregatedData = Array.from(groups.entries()).map(([key, values]) => {
      const aggregated = calculateAggregate(values, config.yAxisAggregation);

      // Format the key for display
      let displayKey = key;
      if (isXAxisDate && config.xAxisGroupByPeriod) {
        displayKey = formatDateGroupKey(key, config.xAxisGroupByPeriod);
      }

      return {
        [xAxisField.name]: displayKey,
        value: aggregated,
        _sortKey: key, // For sorting
      };
    });

    return sortByFieldType(aggregatedData, xAxisField.fieldType);
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
      <div className="p-5 text-sm text-muted-foreground">No data available</div>
    );
  }

  const aggregationLabel = getAggregationLabel(
    config.yAxisAggregation,
    yAxisField?.name
  );

  const chartConfig = {
    value: {
      label: aggregationLabel,
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
          <XAxis type="number" dataKey="value" hide />
          <YAxis
            dataKey={xAxisField.name}
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            width={120}
            tickFormatter={(value) => {
              // Value is already formatted in chartData, return as-is
              return value;
            }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="value" fill="var(--color-value)" radius={5} />
        </BarChart>
      ) : (
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisField.name}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="value" fill="var(--color-value)" radius={8} />
        </BarChart>
      )}
    </ChartContainer>
  );
};