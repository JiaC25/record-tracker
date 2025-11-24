import { registerAnalyticType } from '../../registry';
import { lineChartTypeDefinition } from './type-definition';
import { LineChartConfigForm } from './config-form';
import { LineChartVisualization } from './visualization';

registerAnalyticType({
    typeDefinition: lineChartTypeDefinition,
    ConfigForm: LineChartConfigForm,
    Visualization: LineChartVisualization,
});

