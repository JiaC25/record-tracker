import { registerAnalyticType } from '../../registry';
import { LineChartConfigForm } from './config-form';
import { lineChartTypeDefinition } from './type-definition';
import { LineChartVisualization } from './visualization';

registerAnalyticType({
  typeDefinition: lineChartTypeDefinition,
  ConfigForm: LineChartConfigForm,
  Visualization: LineChartVisualization,
});

