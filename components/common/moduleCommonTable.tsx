import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, RefreshCw, Plus, ArrowLeft, ArrowRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  itemsPerPage?: number;
  isLoading?: boolean;
  searchable?: boolean;
  searchKey?: keyof T;
  searchPlaceholder?: string;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  onRefresh?: () => Promise<void>;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  analyticsCards?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  title,
  description,
  icon,
  itemsPerPage = 10,
  isLoading = false,
  searchable = false,
  searchKey,
  searchPlaceholder = "Search...",
  actions,
  emptyMessage = "No data found",
  onRefresh,
  addButton,
  analyticsCards,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState<T[]>(data);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (searchable && searchKey && searchTerm) {
      const filtered = data.filter((item) => {
        const value = String(item[searchKey]).toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      });
      setFilteredData(filtered);
      setCurrentPage(1);
    } else {
      setFilteredData(data);
    }
  }, [data, searchTerm, searchable, searchKey]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-8">
      {analyticsCards && (
        <div className="grid gap-6 md:grid-cols-3">
          {analyticsCards}
        </div>
      )}

      <Card className="w-full bg-card shadow-lg border-0">
        {(title || description) && (
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {title && (
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    {icon && <div className="text-primary">{icon}</div>}
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="text-muted-foreground">
                    {description}
                  </CardDescription>
                )}
              </div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="hover:bg-primary/10"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
        )}

        <CardContent>
          <div className="flex justify-between items-center mb-6 gap-4">
            {searchable && searchKey && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
            )}
            {addButton && (
              <Button 
                onClick={addButton.onClick}
                className="shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                {addButton.label}
              </Button>
            )}
          </div>

          <div className="rounded-lg border border-border/50 overflow-hidden bg-background/50">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  {columns.map((column, index) => (
                    <TableHead key={index} className="font-semibold">
                      {column.header}
                    </TableHead>
                  ))}
                  {actions && <TableHead className="w-[100px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={actions ? columns.length + 1 : columns.length}
                      className="text-center py-12"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-muted-foreground">Loading data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={actions ? columns.length + 1 : columns.length}
                      className="text-center py-12"
                    >
                      <span className="text-muted-foreground">{emptyMessage}</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((item, rowIndex) => (
                    <TableRow 
                      key={rowIndex}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {column.cell ? column.cell(item) : String(item[column.accessorKey])}
                        </TableCell>
                      ))}
                      {actions && (
                        <TableCell>
                          {actions(item)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DataTable;