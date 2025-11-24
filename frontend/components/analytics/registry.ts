import { AnalyticType } from '@/lib/types/analytics';
import { RecordField, RecordFieldType } from '@/lib/types/records';
import { ReactNode } from 'react';

export type AnalyticTypeDefinition = {
    id: AnalyticType
    name: string
    description: string
    icon?: ReactNode
    supportedFieldTypes?: {
        xAxis?: RecordFieldType[]
        yAxis?: RecordFieldType[]
        value?: RecordFieldType[]
        groupBy?: RecordFieldType[]
    }
}

export type AnalyticTypeComponents = {
    ConfigForm: React.ComponentType<AnalyticConfigFormProps>
    Visualization: React.ComponentType<AnalyticVisualizationProps>
    typeDefinition: AnalyticTypeDefinition
}

export type AnalyticConfigFormProps = {
    recordFields: RecordField[]
    initialConfig?: string // JSON string
    onConfigChange: (config: string) => void
    onValidationChange: (isValid: boolean) => void
}

export type AnalyticVisualizationProps = {
    analytic: {
        id: string
        name: string
        type: AnalyticType
        configuration: string
    }
    recordFields: RecordField[]
    recordItems: Array<Record<string, string>>
}

// Registry will be populated by each analytic type
const registry = new Map<AnalyticType, AnalyticTypeComponents>();

export const registerAnalyticType = (components: AnalyticTypeComponents) => {
  registry.set(components.typeDefinition.id, components);
};

export const getAnalyticType = (type: AnalyticType): AnalyticTypeComponents | undefined => {
  return registry.get(type);
};

export const getAllAnalyticTypes = (): AnalyticTypeDefinition[] => {
  return Array.from(registry.values()).map(c => c.typeDefinition);
};

