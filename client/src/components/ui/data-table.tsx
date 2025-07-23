import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<T>({ 
  data, 
  columns, 
  emptyMessage = "Aucune donnée disponible" 
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {columns.map((column) => {
                    const value = typeof column.key === 'string' && column.key.includes('.') 
                      ? column.key.split('.').reduce((obj, key) => obj?.[key], item as any)
                      : (item as any)[column.key];
                    
                    return (
                      <TableCell key={String(column.key)}>
                        {column.render ? column.render(value, item) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
