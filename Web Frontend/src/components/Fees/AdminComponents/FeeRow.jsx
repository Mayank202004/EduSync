import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/dateUtils";

export default function FeeRow({ fee, className, feeType, onEdit }) {
  return (
    <tr className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">{className}</td>
      <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">{feeType}</td>
      <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">{fee.title}</td>
      <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">{formatDate(fee.dueDate)}</td>
      <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">₹{fee.amount}</td>
      <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">₹{fee.discount}</td>
      <td className="py-2 px-3 text-sm">
        <span className={`px-2 py-1 rounded text-xs font-medium ${fee.compulsory ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"}`}>
          {fee.compulsory ? "Yes" : "No"}
        </span>
      </td>
      <td className="py-2 px-3 text-right">
        <button onClick={() => onEdit(fee)} className="text-blue-500 hover:text-blue-700">
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </td>
    </tr>
  );
}
