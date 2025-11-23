'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DeleteRecordItemDialog } from '@/components/records/delete-record-item-dialog';
import { EditRecordItemPopover } from '@/components/records/edit-record-item-popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRecordStore } from '@/lib/store/recordStore';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateRecordItemPopover } from '@/components/records/create-record-item-popover';

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
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            id={`actions-button-${item.id}`}
          >
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
    ...record.recordFields.map((field) => {
      // Custom sorting function based on field type
      const sortingFn = (rowA: Row<RecordItem>, rowB: Row<RecordItem>) => {
        const valueA = rowA.getValue(field.id) as string | undefined;
        const valueB = rowB.getValue(field.id) as string | undefined;
        
        // Handle empty values (treat as null/undefined)
        if (!valueA || (typeof valueA === 'string' && valueA.trim() === '')) return 1; // Empty values go to the end
        if (!valueB || (typeof valueB === 'string' && valueB.trim() === '')) return -1;
        
        switch (field.fieldType) {
        case 'Date': {
          const dateA = new Date(valueA as string).getTime();
          const dateB = new Date(valueB as string).getTime();
          if (isNaN(dateA)) return 1; // Invalid dates go to the end
          if (isNaN(dateB)) return -1;
          return dateA - dateB;
        }
        case 'Number': {
          const numA = parseFloat(valueA as string);
          const numB = parseFloat(valueB as string);
          if (isNaN(numA)) return 1; // Invalid numbers go to the end
          if (isNaN(numB)) return -1;
          return numA - numB;
        }
        default: // Text
          return (valueA as string).localeCompare(valueB as string);
        }
      };

      return {
        accessorKey: field.id,
        header: field.name,
        enableSorting: true,
        enableHiding: true,
        sortingFn: sortingFn,
        cell: ({ row }: any) => { return buildRecordValueCell(row.getValue(field.id), field.fieldType); },
      };
    }),
    // Actions buttons Column
    {
      id: 'actions',
      header: '',
      enableSorting: false, // Disable sorting for actions column
      enableHiding: false, // Don't allow hiding the actions column
      meta: { headerClassName: 'w-[20px]' },
      cell: ({ row }) => { return buildActionsCell(row); },
    },
  ];

  // Create RecordItem
  const handleItemCreated = (item: RecordItem | null) => {
    // Store updates automatically after server response, no need to refresh
    // Just notify parent if needed for other side effects
    onItemCreated?.();
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
    // The Edit component handles the API call internally via updateRecordItem from useRecordStore
    // Store updates automatically after server response, no need to refresh
    // Just notify parent if needed for other side effects
    onItemCreated?.();
  };

  const getRowClassName = (item: RecordItem) => {
    // Highlight the row being edited
    if (editItem && editItem.id === item.id) {
      return 'bg-primary/10';
    }
    return '';
  };

  const getFirstCellClassName = (item: RecordItem) => {
    // Add a left border to the first cell of the row being edited (using pseudo-element to avoid layout shift)
    if (editItem && editItem.id === item.id) {
      return 'relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary before:content-[""]';
    }
    return '';
  };

  return (
    <>
      <Card className="text-sm rounded-sm gap-3 pt-4 max-h-[85vh] overflow-y-auto">
        <CardContent className="px-3">
          <DataTable 
            columns={columns} 
            data={tableData}
            getRowClassName={getRowClassName}
            getFirstCellClassName={getFirstCellClassName}
            title={record.name}
            description={record.description}
            headerActions={
              <CreateRecordItemPopover record={record} onCreated={handleItemCreated}>
                <Button size="sm" className="w-12" variant="default"><Plus /></Button>
              </CreateRecordItemPopover>
            }
          />
        </CardContent>
      </Card>
      <DeleteRecordItemDialog
        open={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      {/* Edit RecordItem Popover - will be positioned to the corresponding table row using anchorId */}
      {editItem && (
        <EditRecordItemPopover
          open={!!editItem}
          onOpenChange={(open) => {
            if (!open) {
              setEditItem(null);
            }
          }}
          record={record}
          item={editItem}
          onUpdated={handleEditUpdated}
          anchorId={`actions-button-${editItem.id}`}
        />
      )}
    </>
  );
};