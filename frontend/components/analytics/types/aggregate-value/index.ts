import { registerAnalyticType } from '../../registry';
import { aggregateValueTypeDefinition } from './type-definition';
import { AggregateValueConfigForm } from './config-form';
import { AggregateValueVisualization } from './visualization';

registerAnalyticType({
    typeDefinition: aggregateValueTypeDefinition,
    ConfigForm: AggregateValueConfigForm,
    Visualization: AggregateValueVisualization,
});

