import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  showNumSelected?: boolean
  showRowPerPageOption?: boolean
}

export function DataTablePagination<TData>({
  table,
  showNumSelected = false,
  showRowPerPageOption = false,
}: DataTablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div className="flex items-center justify-between px-2 flex-wrap">
      {/* Left side - Selected rows info*/}
      <div className="flex-1">
        <div className="text-sm text-muted-foreground">
          {showNumSelected && selectedCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedCount} of {totalRows} selected
            </div>
          )}
        </div>
      </div>
      {/* Right side - Pagination info and controls*/}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Rows per page option */}
        { showRowPerPageOption && (
          <div className="flex items-center gap-2">
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => { table.setPageSize(Number(value)); }}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    <span className="text-xs">{size} per page</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {/* Page controls */}
        <div className="flex items-center gap-2 min-w-[60%]">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-7 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>

          {/* Page info */}
          <div className="text-muted-foreground text-xs">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-7 lg:flex"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}