'use client';

import { Analytic } from '@/lib/types/analytics';
import { RecordField } from '@/lib/types/records';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnalyticVisualization } from './analytic-visualization';
import { useState } from 'react';
import { EditAnalyticDialog } from './edit-analytic-dialog';
import { DeleteAnalyticDialog } from './delete-analytic-dialog';

type AnalyticCardProps = {
    analytic: Analytic
    recordFields: RecordField[]
    recordItems: Array<Record<string, string>>
    onAnalyticUpdated?: () => void
    onAnalyticDeleted?: () => void
}

export const AnalyticCard = ({ 
    analytic, 
    recordFields, 
    recordItems,
    onAnalyticUpdated,
    onAnalyticDeleted 
}: AnalyticCardProps) => {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <Card className="rounded-sm p-0 gap-0">
                <CardHeader className="flex items-center justify-between py-2 border-b-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{analytic.name}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setShowDeleteDialog(true)}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="p-0">
                    <AnalyticVisualization
                        analytic={analytic}
                        recordFields={recordFields}
                        recordItems={recordItems}
                    />
                </CardContent>
            </Card>

            {showEditDialog && (
                <EditAnalyticDialog
                    open={showEditDialog}
                    analytic={analytic}
                    recordFields={recordFields}
                    onClose={() => setShowEditDialog(false)}
                    onUpdated={() => {
                        setShowEditDialog(false);
                        onAnalyticUpdated?.();
                    }}
                />
            )}

            {showDeleteDialog && (
                <DeleteAnalyticDialog
                    open={showDeleteDialog}
                    analytic={analytic}
                    onClose={() => setShowDeleteDialog(false)}
                    onDeleted={() => {
                        setShowDeleteDialog(false);
                        onAnalyticDeleted?.();
                    }}
                />
            )}
        </>
    );
};

