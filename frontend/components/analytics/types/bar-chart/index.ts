import { registerAnalyticType } from '../../registry';
import { BarChartConfigForm } from './config-form';
import { barChartTypeDefinition } from './type-definition';
import { BarChartVisualization } from './visualization';

registerAnalyticType({
  typeDefinition: barChartTypeDefinition,
  ConfigForm: BarChartConfigForm,
  Visualization: BarChartVisualization,
});
