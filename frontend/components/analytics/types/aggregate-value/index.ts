import { registerAnalyticType } from '../../registry';
import { AggregateValueConfigForm } from './config-form';
import { aggregateValueTypeDefinition } from './type-definition';
import { AggregateValueVisualization } from './visualization';

registerAnalyticType({
  typeDefinition: aggregateValueTypeDefinition,
  ConfigForm: AggregateValueConfigForm,
  Visualization: AggregateValueVisualization,
});

