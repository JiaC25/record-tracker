import { AnalyticTypeDefinition } from '../../registry';

export const barChartTypeDefinition: AnalyticTypeDefinition = {
    id: 'BarChart',
    name: 'Bar Chart',
    description: 'Display data as a bar chart with aggregation set on the Y-axis',
    supportedFieldTypes: {
        xAxis: ['Date', 'Text', 'Number'],
        yAxis: ['Number'],
    },
};
