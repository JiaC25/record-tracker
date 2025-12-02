'use client';

import { DataTable } from '@/components/data-table/data-table';
import { CreateRecordItemPopover } from '@/components/records/create-record-item-popover';
import { DeleteRecordItemDialog } from '@/components/records/delete-record-item-dialog';
import { EditRecordDialog } from '@/components/records/edit-record-dialog';
import { EditRecordItemPopover } from '@/components/records/edit-record-item-popover';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { downloadCSV, exportRecordItemsToCSV, importRecordItemsFromCSV } from '@/lib/helpers/csvHelpers';
import {
  createFieldIdMap,
  createFieldIdMapByName,
  createUpdateRecordRequest,
  downloadJSON,
  exportRecordToJSON,
  mapItemsToCurrentFieldIds,
  parseRecordImportJSON,
  validateFieldMatches
} from '@/lib/helpers/jsonHelpers';
import { useRecordStore } from '@/lib/store/recordStore';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Columns3Cog, FileBracesIcon, FileSpreadsheet, MoreHorizontal, MoreVertical, Pencil, Plus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

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
  const { deleteRecordItem, createRecordItems, updateRecord, fetchRecord } = useRecordStore();
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editItem, setEditItem] = useState<RecordItem | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isEditRecordDialogOpen, setIsEditRecordDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportCSV = () => {
    try {
      const csvContent = exportRecordItemsToCSV(record);
      const filename = `${record.name.replace(/[^a-z0-9]/gi, '_')}_export_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Failed to export records', error);
      alert('Failed to export records. Please try again.');
    }
  };

  const handleExportJSON = () => {
    try {
      const jsonContent = exportRecordToJSON(record);
      const filename = `${record.name.replace(/[^a-z0-9]/gi, '_')}_export_${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(jsonContent, filename);
    } catch (error) {
      console.error('Failed to export records', error);
      alert('Failed to export records. Please try again.');
    }
  };


  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const fileText = await file.text();
      const fileName = file.name.toLowerCase();
      
      // Determine file type by extension
      if (fileName.endsWith('.json')) {
        await handleJSONImport(fileText);
      } else {
        await handleCSVImport(fileText);
      }
      
      // Notify parent
      onItemCreated?.();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to import records', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import records. Please check the file format.';
      alert(`Import failed: ${errorMessage}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleJSONImport = async (fileText: string) => {
    const importData = parseRecordImportJSON(fileText);
    
    // Check if record has no fields
    if (record.recordFields.length === 0) {
      // Record has no fields - create fields and items
      const updateRequest = createUpdateRecordRequest(
        record.id,
        record.name,
        record.description,
        importData.recordFields
      );
      
      await updateRecord(record.id, updateRequest);
      
      // Refresh record to get new field IDs
      const updatedRecord = await fetchRecord(record.id);
      if (!updatedRecord) {
        throw new Error('Failed to refresh record after field creation');
      }
      
      // Map imported field IDs to new field IDs
      const fieldIdMap = createFieldIdMap(importData.recordFields, updatedRecord.recordFields);
      
      // Convert items to use new field IDs
      const itemsWithNewFieldIds = mapItemsToCurrentFieldIds(importData.recordItems, fieldIdMap);
      
      await createRecordItems(record.id, itemsWithNewFieldIds);
      alert(`Successfully imported ${itemsWithNewFieldIds.length} record item(s) and created ${importData.recordFields.length} field(s)`);
    } else {
      // Record has fields - treat like CSV: match fields by name and add items only
      const fieldIdMap = createFieldIdMapByName(importData.recordFields, record.recordFields);
      
      // Validate all imported fields have matches
      validateFieldMatches(importData.recordFields, fieldIdMap);
      
      // Convert items to use current field IDs
      const itemsWithCurrentFieldIds = mapItemsToCurrentFieldIds(importData.recordItems, fieldIdMap);
      
      await createRecordItems(record.id, itemsWithCurrentFieldIds);
      alert(`Successfully imported ${itemsWithCurrentFieldIds.length} record item(s)`);
    }
  };

  const handleCSVImport = async (fileText: string) => {
    const importedItems = importRecordItemsFromCSV(fileText, record);
    await createRecordItems(record.id, importedItems);
    alert(`Successfully imported ${importedItems.length} record item(s)`);
  };

  return (
    <>
      <Card className="text-sm rounded-sm gap-3 py-4 max-h-screen overflow-y-auto scrollbar-styled">
        <CardContent className="px-3">
          <DataTable 
            columns={columns} 
            data={tableData}
            getRowClassName={getRowClassName}
            getFirstCellClassName={getFirstCellClassName}
            title={record.name}
            description={record.description}
            renderCustomizeButton={(table) => {
              const getColumnDisplayName = (column: any): string => {
                const header = column.columnDef.header;
                if (typeof header === 'string') return header;
                if (column.columnDef.meta?.displayName) return column.columnDef.meta.displayName;
                return column.id;
              };

              const hasHideableColumns = table.getAllColumns().some(col => col.getCanHide());

              return (
                <ButtonGroup>
                  {hasHideableColumns && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Columns3Cog className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                          .getAllColumns()
                          .filter((column) => column.getCanHide())
                          .map((column) => {
                            const columnName = getColumnDisplayName(column);
                            return (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                  column.toggleVisibility(!!value)
                                }
                              >
                                {columnName}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsEditRecordDialogOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="px-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleExportCSV}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Export CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportJSON}>
                        <FileBracesIcon className="mr-2 h-4 w-4" />
                        Export JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleImportClick} disabled={isImporting}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ButtonGroup>
              );
            }}
            headerActions={
              <CreateRecordItemPopover record={record} onCreated={handleItemCreated}>
                <Button size="sm" variant="default" className="px-3">
                  <Plus className="h-4 w-4" />
                </Button>
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
      {/* Edit Record Dialog */}
      <EditRecordDialog
        open={isEditRecordDialogOpen}
        record={record}
        onDialogClose={() => setIsEditRecordDialogOpen(false)}
        onUpdated={() => {
          // Refresh the record after update
          fetchRecord(record.id);
          onItemCreated?.();
        }}
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};