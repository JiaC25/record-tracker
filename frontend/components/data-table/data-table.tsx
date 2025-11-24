'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Columns3Cog } from 'lucide-react';
import { cn } from '@/lib/utils';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowClassName?: (row: TData) => string;
  getFirstCellClassName?: (row: TData) => string;
  headerActions?: React.ReactNode;
  title?: string;
  description?: string;
};

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

export const DataTable = <TData, TValue>({ columns, data, getRowClassName, getFirstCellClassName, headerActions, title, description }: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  // Helper function to get column display name
  const getColumnDisplayName = (column: any): string => {
    const header = column.columnDef.header;
    
    // If header is a string, use it directly
    if (typeof header === 'string') {
      return header;
    }
    
    // If header is a function, try to extract name from column definition
    // Check if there's a meta.displayName as fallback
    if (column.columnDef.meta?.displayName) {
      return column.columnDef.meta.displayName;
    }
    
    // Last resort: use column ID
    return column.id;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header: Title/Description + Actions */}
      {(title || description || headerActions || table.getAllColumns().some(col => col.getCanHide())) && (
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Title and Description */}
          {(title || description) && (
            <div className="min-w-0 flex-1">
              {title && (
                <h4 className="truncate font-semibold">{title}</h4>
              )}
              {description && (
                <small className="text-muted-foreground">{description}</small>
              )}
            </div>
          )}
          
          {/* Right side: Actions */}
          <div className="flex items-center gap-2">
            {table.getAllColumns().some(col => col.getCanHide()) && (
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
            {headerActions}
          </div>
        </div>
      )}
      {/* Table */}
      <div
        data-slot="table-container"
        className="relative w-full overflow-auto rounded-sm border max-h-[61vh] scrollbar-styled"
      >
        <Table>
          <TableHeader
            className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  const headerDef = header.column.columnDef.header;

                  // If header is a function, it's a custom renderer - use it as-is
                  // If header is a string and column is sortable, wrap it in a Button
                  const isCustomHeader = typeof headerDef === 'function';

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'font-semibold',
                        header.column.columnDef.meta?.headerClassName
                      )}
                    >
                      {!header.isPlaceholder && canSort && !isCustomHeader ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-3 h-8 data-[state=open]:bg-accent"
                          onClick={() => header.column.toggleSorting()}
                        >
                          <span>{flexRender(headerDef, header.getContext())}</span>
                          {isSorted === 'asc' ? (
                            <ArrowUp className="ml-2 h-4 w-4 text-secondary-foreground/50" />
                          ) : isSorted === 'desc' ? (
                            <ArrowDown className="ml-2 h-4 w-4 text-secondary-foreground/50" />
                          ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 text-secondary-foreground/50" />
                          )}
                        </Button>
                      ) : (
                        header.isPlaceholder
                          ? null
                          : flexRender(headerDef, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const visibleCells = row.getVisibleCells();
                const isFirstCell = (index: number) => index === 0;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={getRowClassName?.(row.original)}
                  >
                    {visibleCells.map((cell, cellIndex) => (
                      <TableCell
                        key={cell.id}
                        className={
                          'py-0.5 text-[0.85rem] '
                          + cell.column.columnDef.meta?.cellClassName
                          + (isFirstCell(cellIndex) && getFirstCellClassName ? ' ' + getFirstCellClassName(row.original) : '')
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls UI */}
      <DataTablePagination table={table} showRowPerPageOption={true}/>
    </div>
  );
};