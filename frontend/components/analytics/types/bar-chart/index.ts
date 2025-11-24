import { registerAnalyticType } from '../../registry';
import { barChartTypeDefinition } from './type-definition';
import { BarChartConfigForm } from './config-form';
import { BarChartVisualization } from './visualization';

registerAnalyticType({
    typeDefinition: barChartTypeDefinition,
    ConfigForm: BarChartConfigForm,
    Visualization: BarChartVisualization,
});

