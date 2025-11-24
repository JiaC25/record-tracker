import { AnalyticType } from '@/lib/types/analytics';
import { ReactNode } from 'react';

export type AnalyticTypeDefinition = {
    id: AnalyticType
    name: string
    description: string
    icon?: ReactNode
    supportedFieldTypes?: {
        xAxis?: ('Text' | 'Number' | 'Date')[]
        yAxis?: ('Text' | 'Number' | 'Date')[]
        value?: ('Text' | 'Number' | 'Date')[]
        groupBy?: ('Text' | 'Number' | 'Date')[]
    }
}

export type AnalyticTypeComponents = {
    ConfigForm: React.ComponentType<AnalyticConfigFormProps>
    Visualization: React.ComponentType<AnalyticVisualizationProps>
    typeDefinition: AnalyticTypeDefinition
}

export type AnalyticConfigFormProps = {
    recordFields: Array<{ id: string; name: string; fieldType: 'Text' | 'Number' | 'Date' }>
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
    recordFields: Array<{ id: string; name: string; fieldType: 'Text' | 'Number' | 'Date' }>
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

