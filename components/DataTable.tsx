


import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import EmptyState from './EmptyState.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { EyeIcon, ShoppingCartIcon } from './Icons.tsx';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title: string;
  onRowClick?: (item: T) => void;
}

const DataTable = <T extends { id: string }>({ columns, data, title, onRowClick }: DataTableProps<T>) => {
  const isClickable = !!onRowClick;

  const getRowClassName = (isClickable: boolean) => {
    const baseClasses = 'transition-colors duration-150';
    const clickableClasses = isClickable
      ? 'hover:bg-gray-50 dark:hover:bg-gray-700/40 cursor-pointer'
      : '';
    return `${baseClasses} ${clickableClasses}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.header}
                      scope="col"
                      className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                  {isClickable && <th scope="col" className="relative px-3 sm:px-6 py-3"><span className="sr-only">View</span></th>}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => onRowClick?.(item)}
                      className={getRowClassName(isClickable)}
                    >
                      {columns.map((col) => (
                        <td key={`${item.id}-${String(col.accessor)}`} className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {col.render ? col.render(item) : String(item[col.accessor] ?? '')}
                        </td>
                      ))}
                      {isClickable && (
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-right text-sm">
                          <EyeIcon className="w-4 h-4 text-gray-400 inline" />
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + (isClickable ? 1 : 0)} className="py-12">
                       <EmptyState
                            icon={<ShoppingCartIcon className="w-12 h-12 text-gray-400" />}
                            title="No Activity Yet"
                            message="Your recent checkouts and savings will appear here once you start shopping."
                       />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;