import { AnalyticTypeDefinition } from '../../registry';
import { X_AXIS_FIELD_TYPES, Y_AXIS_FIELD_TYPES } from '@/lib/utils/analytics';

export const lineChartTypeDefinition: AnalyticTypeDefinition = {
    id: 'LineChart',
    name: 'Line Chart',
    description: 'Display data as a line chart with X and Y axes',
    supportedFieldTypes: {
        xAxis: X_AXIS_FIELD_TYPES,
        yAxis: Y_AXIS_FIELD_TYPES,
    },
};

