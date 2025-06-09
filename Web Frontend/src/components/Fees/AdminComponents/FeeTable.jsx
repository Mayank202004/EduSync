import React from "react";
import FeeRow from "./FeeRow";

export default function FeeTable({ visibleFees, onEdit }) {
  return (
    <div className="overflow-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          <tr>
            <th className="py-3 px-4 font-semibold">Class</th>
            <th className="py-3 px-4 font-semibold">Fee Type</th>
            <th className="py-3 px-4 font-semibold">Title</th>
            <th className="py-3 px-4 font-semibold">Due Date</th>
            <th className="py-3 px-4 font-semibold">Amount</th>
            <th className="py-3 px-4 font-semibold">Discount</th>
            <th className="py-3 px-4 font-semibold">Compulsory</th>
            <th className="py-3 px-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {visibleFees.map((fee) => (
            <FeeRow
              key={fee._id}
              fee={fee}
              className={fee.className}
              feeType={fee.feeType}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
