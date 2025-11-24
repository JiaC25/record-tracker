'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AggregateFunction, AggregateValueConfig, GroupByPeriod } from '@/lib/types/analytics';
import { FIELD_TYPES, filterFieldsByType, parseConfig } from '@/lib/utils/analytics';
import { useEffect, useState } from 'react';
import { AnalyticConfigFormProps } from '../../registry';

export const AggregateValueConfigForm = ({
  recordFields,
  initialConfig,
  onConfigChange,
  onValidationChange,
}: AnalyticConfigFormProps) => {
  const [aggregationFunction, setAggregationFunction] = useState<AggregateFunction>('average');
  const [valueFieldId, setValueFieldId] = useState<string>('');
  const [groupByFieldId, setGroupByFieldId] = useState<string>('__none__');
  const [groupByPeriod, setGroupByPeriod] = useState<GroupByPeriod | null>(null);

  const numberFields = filterFieldsByType(recordFields, FIELD_TYPES.NUMBER);
  const dateFields = filterFieldsByType(recordFields, FIELD_TYPES.DATE);

  useEffect(() => {
    if (initialConfig) {
      const defaultConfig: AggregateValueConfig = {
        configVersion: 1,
        aggregationFunction: 'average',
        valueFieldId: '',
      };
      const config = parseConfig<AggregateValueConfig>(initialConfig, defaultConfig);
      setAggregationFunction(config.aggregationFunction || 'average');
      setValueFieldId(config.valueFieldId || '');
      setGroupByFieldId(config.groupByFieldId || '__none__');
      setGroupByPeriod(config.groupByPeriod || null);
    }
  }, [initialConfig]);

  // Reset grouping when switching away from average
  useEffect(() => {
    if (aggregationFunction !== 'average') {
      setGroupByFieldId('__none__');
      setGroupByPeriod(null);
    }
  }, [aggregationFunction]);

  useEffect(() => {
    const isValid = !!valueFieldId && numberFields.some(f => f.id === valueFieldId);
    onValidationChange(isValid);

    if (isValid) {
      const config: AggregateValueConfig = {
        configVersion: 1,
        aggregationFunction,
        valueFieldId,
        // Only include grouping for average
        groupByFieldId: aggregationFunction === 'average' && groupByFieldId && groupByFieldId !== '__none__' ? groupByFieldId : undefined,
        groupByPeriod: aggregationFunction === 'average' && groupByPeriod ? groupByPeriod : undefined,
      };
      onConfigChange(JSON.stringify(config));
    }
  }, [aggregationFunction, valueFieldId, groupByFieldId, groupByPeriod, numberFields, onConfigChange, onValidationChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">Calculate the</span>
        <Select value={aggregationFunction} onValueChange={(value) => setAggregationFunction(value as AggregateFunction)}>
          <SelectTrigger className="w-[120px] mx-1">
            <SelectValue placeholder="Select function" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="max">Maximum</SelectItem>
            <SelectItem value="min">Minimum</SelectItem>
            <SelectItem value="sum">Sum</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm">of</span>
        <Select value={valueFieldId} onValueChange={setValueFieldId}>
          <SelectTrigger className="w-fit mx-1">
            <SelectValue placeholder="Select a Number field" />
          </SelectTrigger>
          <SelectContent>
            {numberFields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {dateFields.length > 0 && aggregationFunction === 'average' && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm">Group by</span>
          <Select value={groupByFieldId} onValueChange={setGroupByFieldId}>
            <SelectTrigger className="w-fit mx-1">
              <SelectValue placeholder="None (overall average)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {dateFields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {groupByFieldId && groupByFieldId !== '__none__' && (
            <>
              <span className="text-sm">per</span>
              <Select 
                value={groupByPeriod || undefined} 
                onValueChange={(value) => setGroupByPeriod(value as GroupByPeriod | null)}
              >
                <SelectTrigger className="w-[120px] mx-1">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      )}
    </div>
  );
};

