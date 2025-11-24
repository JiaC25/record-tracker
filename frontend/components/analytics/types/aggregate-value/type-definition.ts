import { AnalyticTypeDefinition } from '../../registry';

export const aggregateValueTypeDefinition: AnalyticTypeDefinition = {
    id: 'AggregateValue',
    name: 'Aggregate Value',
    description: 'Calculate aggregate values of a numeric field, optionally grouped by time period',
    supportedFieldTypes: {
        value: ['Number'],
        groupBy: ['Date'],
    },
};

