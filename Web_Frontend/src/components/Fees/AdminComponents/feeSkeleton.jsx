import React from "react";

function TableSkeletonRow({ columns = 8 }) {
  return (
    <tr>
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse"></div>
        </td>
      ))}
    </tr>
  );
}

function FeeTableSkeleton({ rows = 4 }) {
  return (
    <div className="overflow-auto bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6">
      <table className="min-w-full table-fixed text-left text-sm">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          <tr>
            {[
              "Class",
              "Fee Type",
              "Title",
              "Due Date",
              "Amount",
              "Discount",
              "Compulsory",
              "Action",
            ].map((header, index) => (
              <th
                key={index}
                className="py-3 px-4 font-semibold w-[12%] truncate"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(rows)].map((_, i) => (
            <TableSkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminFeesSkeleton() {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen w-full animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="h-10 w-40 bg-gray-300 dark:bg-gray-600 rounded mb-4 sm:mb-0"></div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold my-4 bg-gray-300 dark:bg-gray-700 w-48 h-6 rounded"></h2>
        <FeeTableSkeleton rows={4} />
      </div>
      <div>
        <h2 className="text-xl font-bold my-4 bg-gray-300 dark:bg-gray-700 w-48 h-6 rounded"></h2>
        <FeeTableSkeleton rows={2} />
      </div>
      <div>
        <h2 className="text-xl font-bold my-4 bg-gray-300 dark:bg-gray-700 w-48 h-6 rounded"></h2>
        <FeeTableSkeleton rows={2} />
      </div>
    </div>
  );
}
