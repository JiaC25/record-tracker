'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RecordField } from '@/lib/types/records';
import { AnalyticType, CreateAnalyticRequest } from '@/lib/types/analytics';
import { getAllAnalyticTypes } from './registry';
import { getAnalyticType } from './registry';
import { useAnalyticsStore } from '@/lib/store/analyticsStore';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type CreateAnalyticDialogProps = {
    open: boolean
    recordId: string
    recordFields: RecordField[]
    onClose: () => void
    onCreated: () => void
}

export const CreateAnalyticDialog = ({
    open,
    recordId,
    recordFields,
    onClose,
    onCreated
}: CreateAnalyticDialogProps) => {
    const { createAnalytic } = useAnalyticsStore();
    const [selectedType, setSelectedType] = useState<AnalyticType | null>(null);
    const [name, setName] = useState('');
    const [config, setConfig] = useState<string>('');
    const [isConfigValid, setIsConfigValid] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const availableTypes = getAllAnalyticTypes();
    const typeComponents = selectedType ? getAnalyticType(selectedType) : null;

    const handleTypeSelect = (type: AnalyticType) => {
        setSelectedType(type);
        setName('');
        setConfig('');
        setIsConfigValid(false);
    };

    const handleSave = async () => {
        if (!selectedType || !name.trim() || !isConfigValid || !config) return;

        setIsSaving(true);
        try {
            // Get current analytics to determine next order
            const analytics = useAnalyticsStore.getState().getAnalytics(recordId);
            const nextOrder = analytics.length > 0
                ? Math.max(...analytics.map(a => a.order)) + 1
                : 0;

            const request: CreateAnalyticRequest = {
                recordId,
                name: name.trim(),
                type: selectedType,
                configuration: config,
                order: nextOrder,
            };

            await createAnalytic(recordId, request);
            onCreated();
        } catch (error) {
            console.error('Failed to create analytic', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setSelectedType(null);
        setName('');
        setConfig('');
        setIsConfigValid(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose} >
            <DialogContent className="max-w-full sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Create New Analytic</DialogTitle>
                    <DialogDescription>
                        Select an analytic type and configure it to visualize your data.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                    <div className="space-y-4">
                        {/* Show selected type card at top if a type is selected */}
                        {selectedType && typeComponents && (
                            <Card className="rounded-md py-0 m-2 mb-5 border-l-primary border-l-2">
                                <CardContent className="p-4 flex items-center gap-3 justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium">{typeComponents.typeDefinition.name}</div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {typeComponents.typeDefinition.description}
                                        </div>
                                    </div>
                                    <div className="min-w-20">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleTypeSelect(null as any)}
                                        >
                                            Change Type
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Show all types if none selected, or hide them if one is selected */}
                        {!selectedType && (
                            <div className="flex flex-col">
                                {availableTypes.map((type) => (
                                    <Card
                                        key={type.id}
                                        onClick={() => handleTypeSelect(type.id)}
                                        className="rounded-md hover:bg-accent cursor-pointer transition-colors py-0 m-1"
                                    >
                                        <CardContent className="p-4">
                                            <div className="font-medium">{type.name}</div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {type.description}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Show config form below selected type card */}
                        {selectedType && typeComponents && (
                            <div className="space-y-4 mx-2">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter analytic name"
                                        maxLength={100}
                                    />
                                </div>
                                <Label htmlFor="config">Config</Label>
                                <Card id="config" className="rounded-md">
                                    <CardContent>
                                        <typeComponents.ConfigForm
                                            recordFields={recordFields}
                                            onConfigChange={setConfig}
                                            onValidationChange={setIsConfigValid}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    {selectedType && (
                        <Button
                            disabled={!name.trim() || !isConfigValid || isSaving}
                            onClick={handleSave}
                        >
                            {isSaving ? 'Creating…' : 'Create'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

