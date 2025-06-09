import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";



const dummyFeesData = [
  {
    _id: "68299233501c1a93bc38181b",
    class: "1",
    fee: [
      {
        feeType: "Tuition Fee",
        structure: [
          {
            _id: "68299233501c1a93bc381809",
            title: "Term 1",
            dueDate: "2025-06-30T00:00:00.000+00:00",
            compulsory: true,
            amount: 12000,
            discount: 1000,
          },
          {
            _id: "68299233501c1a93bc381810",
            title: "Term 2",
            dueDate: "2025-09-01T00:00:00.000+00:00",
            compulsory: false,
            amount: 13000,
            discount: 0,
          },
        ],
      },
      {
        feeType: "Transport Fee",
        structure: [
          {
            _id: "68299233501c1a93bc381820",
            title: "Annual",
            dueDate: "2025-06-15T00:00:00.000+00:00",
            compulsory: true,
            amount: 8000,
            discount: 500,
          },
        ],
      },
      {
        feeType: "Other Fee",
        structure: [
          {
            _id: "68299233501c1a93bc381830",
            title: "Library",
            dueDate: "2025-07-15T00:00:00.000+00:00",
            compulsory: true,
            amount: 1500,
            discount: 0,
          },
        ],
      },
    ],
  },
  {
    _id: "68299233501c1a93bc38181c",
    class: "2",
    fee: [
      {
        feeType: "Tuition Fee",
        structure: [
          {
            _id: "68299233501c1a93bc381811",
            title: "Term 1",
            dueDate: "2025-06-30T00:00:00.000+00:00",
            compulsory: true,
            amount: 14000,
            discount: 1000,
          },
          {
            _id: "68299233501c1a93bc381812",
            title: "Term 2",
            dueDate: "2025-09-01T00:00:00.000+00:00",
            compulsory: false,
            amount: 13500,
            discount: 500,
          },
        ],
      },
    ],
  },
];




function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const FeeRow = ({ fee, className, feeType, onEdit }) => (
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

export default function AdminFees() {
  const [feesData] = useState(dummyFeesData);
  const [selectedClass, setSelectedClass] = useState(dummyFeesData[0].class);
  const [mode, setMode] = useState("single");

  const handleEdit = (item) => {
    console.log("Edit clicked for:", item);
  };

  const getVisibleFees = () => {
    const classes = mode === "all" ? feesData : feesData.filter((c) => c.class === selectedClass);
    const allFees = [];

    classes.forEach((cls) => {
      cls.fee.forEach((feeBlock) => {
        feeBlock.structure.forEach((fee) => {
          allFees.push({ ...fee, className: cls.class, feeType: feeBlock.feeType });
        });
      });
    });

    return allFees;
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Fees Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={mode === "all"}
            className="px-3 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {feesData.map((item) => (
              <option key={item.class} value={item.class}>
                Class {item.class}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setMode(mode === "all" ? "single" : "all")}
          >
            {mode === "all" ? "View Single Class" : "Edit All Classes"}
          </button>
        </div>
      </div>

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
            {getVisibleFees().map((fee) => (
              <FeeRow
                key={fee._id}
                fee={fee}
                className={fee.className}
                feeType={fee.feeType}
                onEdit={handleEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
