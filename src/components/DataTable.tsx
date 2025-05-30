import React, { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
  emptyMessage?: string;
}

function DataTable<T>({
  columns,
  data,
  keyExtractor,
  className = '',
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-4">{emptyMessage}</div>;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`py-2 px-4 text-left text-sm font-medium text-gray-700 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr 
              key={keyExtractor(item, rowIndex)} 
              className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              {columns.map((column, colIndex) => {
                const cellContent = typeof column.accessor === 'function' 
                  ? column.accessor(item)
                  : item[column.accessor];
                
                return (
                  <td 
                    key={colIndex} 
                    className={`py-2 px-4 text-sm text-gray-700 ${column.className || ''}`}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
