'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChartConfig } from '@/lib/types/analytics';
import { filterFieldsByTypes, parseConfig, X_AXIS_FIELD_TYPES, Y_AXIS_FIELD_TYPES } from '@/lib/utils/analytics';
import { useEffect, useState } from 'react';
import { AnalyticConfigFormProps } from '../../registry';

export const LineChartConfigForm = ({
  recordFields,
  initialConfig,
  onConfigChange,
  onValidationChange,
}: AnalyticConfigFormProps) => {
  const [xAxisFieldId, setXAxisFieldId] = useState<string>('');
  const [yAxisFieldId, setYAxisFieldId] = useState<string>('');

  const xAxisFields = filterFieldsByTypes(recordFields, X_AXIS_FIELD_TYPES);
  const yAxisFields = filterFieldsByTypes(recordFields, Y_AXIS_FIELD_TYPES);

  useEffect(() => {
    if (initialConfig) {
      const config = parseConfig<LineChartConfig>(initialConfig, { configVersion: 1, xAxisFieldId: '', yAxisFieldId: '' });
      setXAxisFieldId(config.xAxisFieldId || '');
      setYAxisFieldId(config.yAxisFieldId || '');
    }
  }, [initialConfig]);

  useEffect(() => {
    const isValid = !!xAxisFieldId && !!yAxisFieldId &&
            xAxisFields.some(f => f.id === xAxisFieldId) &&
            yAxisFields.some(f => f.id === yAxisFieldId);
    onValidationChange(isValid);

    if (isValid) {
      const config: LineChartConfig = {
        configVersion: 1,
        xAxisFieldId,
        yAxisFieldId,
      };
      onConfigChange(JSON.stringify(config));
    }
  }, [xAxisFieldId, yAxisFieldId, xAxisFields, yAxisFields, onConfigChange, onValidationChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">X-Axis</span>
        <Select value={xAxisFieldId} onValueChange={setXAxisFieldId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {xAxisFields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name} ({field.fieldType})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">Y-Axis</span>
        <Select value={yAxisFieldId} onValueChange={setYAxisFieldId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select field"/>
          </SelectTrigger>
          <SelectContent>
            {yAxisFields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

