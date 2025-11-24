'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAnalyticsStore } from '@/lib/store/analyticsStore';
import { Analytic, UpdateAnalyticRequest } from '@/lib/types/analytics';
import { RecordField } from '@/lib/types/records';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { getAnalyticType } from './registry';

type EditAnalyticDialogProps = {
    open: boolean
    analytic: Analytic
    recordFields: RecordField[]
    onClose: () => void
    onUpdated: () => void
}

export const EditAnalyticDialog = ({ 
  open, 
  analytic, 
  recordFields, 
  onClose, 
  onUpdated 
}: EditAnalyticDialogProps) => {
  const { updateAnalytic } = useAnalyticsStore();
  const [name, setName] = useState(analytic.name);
  const [config, setConfig] = useState(analytic.configuration);
  const [isConfigValid, setIsConfigValid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const typeComponents = getAnalyticType(analytic.type);

  useEffect(() => {
    if (open) {
      setName(analytic.name);
      setConfig(analytic.configuration);
      setIsConfigValid(true);
    }
  }, [open, analytic]);

  const handleSave = async () => {
    if (!name.trim() || !isConfigValid || !config) return;

    setIsSaving(true);
    try {
      const request: UpdateAnalyticRequest = {
        analyticId: analytic.id,
        recordId: analytic.recordId,
        name: name.trim(),
        configuration: config,
        order: analytic.order,
      };

      await updateAnalytic(analytic.recordId, analytic.id, request);
      onUpdated();
    } catch (error) {
      console.error('Failed to update analytic', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Analytic</DialogTitle>
          <DialogDescription>
                        Update the configuration for this analytic.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
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
                {typeComponents && (
                  <typeComponents.ConfigForm
                    recordFields={recordFields}
                    initialConfig={analytic.configuration}
                    onConfigChange={setConfig}
                    onValidationChange={setIsConfigValid}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
                        Cancel
          </Button>
          <Button
            disabled={!name.trim() || !isConfigValid || isSaving}
            onClick={handleSave}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

