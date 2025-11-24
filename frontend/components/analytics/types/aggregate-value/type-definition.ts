import { AnalyticTypeDefinition } from '../../registry';
import { FIELD_TYPES } from '@/lib/utils/analytics';

export const aggregateValueTypeDefinition: AnalyticTypeDefinition = {
    id: 'AggregateValue',
    name: 'Aggregate Value',
    description: 'Calculate aggregate values of a numeric field, optionally grouped by time period',
    supportedFieldTypes: {
        value: [FIELD_TYPES.NUMBER],
        groupBy: [FIELD_TYPES.DATE],
    },
};

