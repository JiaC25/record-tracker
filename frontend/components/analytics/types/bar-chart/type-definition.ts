import { X_AXIS_FIELD_TYPES, Y_AXIS_FIELD_TYPES } from '@/lib/utils/analytics';
import { AnalyticTypeDefinition } from '../../registry';

export const barChartTypeDefinition: AnalyticTypeDefinition = {
  id: 'BarChart',
  name: 'Bar Chart',
  description: 'Display data as a bar chart with aggregation set on the Y-axis',
  supportedFieldTypes: {
    xAxis: X_AXIS_FIELD_TYPES,
    yAxis: Y_AXIS_FIELD_TYPES,
  },
};
