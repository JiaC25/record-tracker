'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalyticConfigFormProps } from '../../registry';
import { LineChartConfig } from '@/lib/types/analytics';

export const LineChartConfigForm = ({
    recordFields,
    initialConfig,
    onConfigChange,
    onValidationChange,
}: AnalyticConfigFormProps) => {
    const [xAxisFieldId, setXAxisFieldId] = useState<string>('');
    const [yAxisFieldId, setYAxisFieldId] = useState<string>('');

    const xAxisFields = recordFields.filter(f => ['Date', 'Text', 'Number'].includes(f.fieldType));
    const yAxisFields = recordFields.filter(f => f.fieldType === 'Number');

    useEffect(() => {
        if (initialConfig) {
            try {
                const config: LineChartConfig = JSON.parse(initialConfig);
                setXAxisFieldId(config.xAxisFieldId || '');
                setYAxisFieldId(config.yAxisFieldId || '');
            } catch {
                // Invalid config, use defaults
            }
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
                        <SelectValue placeholder="Select field" />
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

