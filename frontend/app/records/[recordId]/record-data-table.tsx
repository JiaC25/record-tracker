'use client';

import { DataTable } from '@/components/data-table/data-table';
import { CreateRecordItemButton } from '@/components/records/create-record-item-button';
import { DeleteRecordItemDialog } from '@/components/records/delete-record-item-dialog';
import { EditRecordItemDialog } from '@/components/records/edit-record-item-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRecordStore } from '@/lib/store/recordStore';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Columns3Cog, MoreVertical } from 'lucide-react';
import { useState } from 'react';

type RecordDataTableProps = {
    record: RecordEntity;
    onItemCreated?: () => void;
};

export const RecordDataTable = ({ record, onItemCreated }: RecordDataTableProps) => {
  // Filter out items with no values (defensive - should be handled by backend, but just in case)
  // An item has values if it has any keys other than 'id' and 'createdAt' with non-empty values
  const tableData = record.recordItems.filter(item => {
    const fieldKeys = Object.keys(item).filter(key => key !== 'id' && key !== 'createdAt');
    return fieldKeys.some(key => item[key] && item[key].trim() !== '');
  });
  const { deleteRecordItem } = useRecordStore();
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editItem, setEditItem] = useState<RecordItem | null>(null);

  const buildRecordValueCell = (value: any, fieldType: string) => {
    if (!value || value.trim() === '') {
      return <span>-</span>;
    }

    switch (fieldType) {
    case 'Date':
      const date = new Date(value);
      return <span>{date.toLocaleDateString()}</span>;
    case 'Number':
      return <span>{value}</span>;
    default:
      return <span>{value}</span>;
    }
  };

  const buildActionsCell = (row: Row<RecordItem>) => {
    const item = row.original;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEditClick(item)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            variant="destructive"
            onClick={() => handleDeleteClick(item.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const columns: ColumnDef<RecordItem>[] = [
    // Dynamic RecordFields columns
    ...record.recordFields.map((field) => ({
      accessorKey: field.id,
      header: field.name,
      cell: ({ row }: any) => { return buildRecordValueCell(row.getValue(field.id), field.fieldType); },
    })),
    // Actions buttons Column
    {
      id: 'actions',
      header: '',
      meta: { headerClassName: 'w-[20px]' },
      cell: ({ row }) => { return buildActionsCell(row); },
    },
  ];

  // Create RecordItem
  const handleItemCreated = (item: RecordItem | null) => {
    // Trigger parent to refetch data
    onItemCreated?.();

    // Todo: update api to return record item on created and do optimistic update
    // if (item) {
    //   setTableData((prev) => [...prev, item]);
    // }
  };

  const handleDeleteClick = (itemId: string) => {
    setDeleteItemId(itemId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;

    setIsDeleting(true);
    try {
      await deleteRecordItem(record.id, deleteItemId);
      setDeleteItemId(null);
    } catch (error) {
      console.error('Failed to delete record item', error);
      // Dialog will stay open on error so user can retry or cancel
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (item: RecordItem) => {
    setEditItem(item);
  };

  const handleEditUpdated = async () => {
    // The dialog handles the API call internally via updateRecordItem from useRecordStore
    // We just need to trigger parent refresh here
    onItemCreated?.();
  };


  return (
    <>
      <Card className="text-sm rounded-sm gap-3 pt-4 max-h-[85vh] overflow-y-auto">
        <CardHeader className="space-y-1 px-3">
          <div className="flex justify-between items-center">
            <div className="min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 className="truncate max-w-[24rem]" title={record.name}>{record.name}</h4>
                </TooltipTrigger>
                <TooltipContent sideOffset={6}>{record.name}</TooltipContent>
              </Tooltip>
              {record.description && (<small>{record.description}</small>)}
            </div>
            <div className="flex gap-2">
              {/* Table Columns Config */}
              <Button variant="outline" size="sm"><Columns3Cog /></Button>
              {/* Add RecordItem button */}
              <CreateRecordItemButton
                record={record}
                onCreated={handleItemCreated}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3">
          <DataTable columns={columns} data={tableData}/>
        </CardContent>
      </Card>
      <DeleteRecordItemDialog
        open={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      {editItem && (
        <EditRecordItemDialog
          open={!!editItem}
          onDialogClose={() => setEditItem(null)}
          record={record}
          item={editItem}
          onUpdated={handleEditUpdated}
        />
      )}
    </>
  );
};