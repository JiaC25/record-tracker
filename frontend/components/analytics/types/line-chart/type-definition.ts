import { AnalyticTypeDefinition } from '../../registry';

export const lineChartTypeDefinition: AnalyticTypeDefinition = {
    id: 'LineChart',
    name: 'Line Chart',
    description: 'Display data as a line chart with X and Y axes',
    supportedFieldTypes: {
        xAxis: ['Date', 'Text', 'Number'],
        yAxis: ['Number'],
    },
};

