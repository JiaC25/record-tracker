'use client';

import { Analytic } from '@/lib/types/analytics';
import { RecordField } from '@/lib/types/records';
import { AnalyticErrorState } from './analytic-error-state';
import { getAnalyticType } from './registry';

type AnalyticVisualizationProps = {
    analytic: Analytic
    recordFields: RecordField[]
    recordItems: Array<Record<string, string>>
}

export const AnalyticVisualization = ({ 
  analytic, 
  recordFields, 
  recordItems 
}: AnalyticVisualizationProps) => {
  const typeComponents = getAnalyticType(analytic.type);

  if (!typeComponents) {
    return (
      <AnalyticErrorState 
        message={`Unknown analytic type: ${analytic.type}`}
      />
    );
  }

  // Validate field references
  let config: any;
  try {
    config = JSON.parse(analytic.configuration);
  } catch {
    return (
      <AnalyticErrorState 
        message="Invalid configuration format"
      />
    );
  }

  // Validate field IDs exist
  const fieldIds = new Set(recordFields.map(f => f.id));
  const missingFields: string[] = [];
    
  // Extract field IDs from config based on type
  const fieldIdKeys = ['xAxisFieldId', 'yAxisFieldId', 'valueFieldId', 'groupByFieldId'];
  for (const key of fieldIdKeys) {
    if (config[key] && !fieldIds.has(config[key])) {
      const field = recordFields.find(f => f.id === config[key]);
      missingFields.push(field?.name || config[key]);
    }
  }

  if (missingFields.length > 0) {
    return (
      <AnalyticErrorState 
        message={`Field(s) no longer exist: ${missingFields.join(', ')}`}
      />
    );
  }

  const Visualization = typeComponents.Visualization;
  return (
    <Visualization
      analytic={analytic}
      recordFields={recordFields}
      recordItems={recordItems}
    />
  );
};

