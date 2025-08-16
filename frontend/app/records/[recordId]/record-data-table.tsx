'use client';

import { DataTable } from '@/components/data-table/data-table';
import { CreateRecordItemButton } from '@/components/records/create-record-item-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Columns3Cog, MoreVertical } from 'lucide-react';

type RecordDataTableProps = {
    record: RecordEntity;
    onItemCreated?: () => void;
};

export const RecordDataTable = ({ record, onItemCreated }: RecordDataTableProps) => {
  // const [tableData, setTableData] = useState<RecordItem[]>(record.recordItems);
  const tableData = record.recordItems;

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
          <DropdownMenuItem>Action 1</DropdownMenuItem>
          <DropdownMenuItem>Action 2</DropdownMenuItem>
          <DropdownMenuItem variant="destructive"
            onClick={() => console.log(`delete ${item.id}`)}>
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


  return (
    <Card className="text-sm rounded-sm gap-3 pt-4 max-h-[85vh] overflow-y-auto">
      <CardHeader className="space-y-1 px-3">
        <div className="flex justify-between items-center">
          <div>
            <h4>{record.name}</h4>
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
  );
};