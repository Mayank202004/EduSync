import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import FeeTable from "@/components/Fees/AdminComponents/FeeTable";
import { formatDate } from "@/utils/utils.js";
import AddFeeModal from "@/components/Fees/AdminComponents/AddFeeModal";

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


export default function AdminFees() {
  const [feesData, setFeesData] = useState(dummyFeesData);
  const [selectedClass, setSelectedClass] = useState(dummyFeesData[0].class);
  const [showAddModal, setShowAddModal] = useState(false)

  const handleEdit = (item) => {
    console.log("Edit clicked for:", item);
  };

  const handleAddFee = () => {
    setShowAddModal(true);
  };

  const handleAddRequest = async (payload) => {
    //To do : Add backend request
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: payload }), 1000);
    });
  };

  const handleAddFeeSubmit = (newFee) => {
    setFeesData((prevData) => {
      const updatedData = [...prevData];
  
      if (newFee.addToAll) {
        // Add to all classes
        return updatedData.map((classData) => {
          const feeIndex = classData.fee.findIndex(f => f.feeType === newFee.feeType);
          const newStructure = {
            _id: Date.now().toString(),
            title: newFee.title,
            dueDate: newFee.dueDate,
            amount: newFee.amount,
            discount: newFee.discount,
            compulsory: newFee.compulsory,
          };
      
          if (feeIndex !== -1) {
            classData.fee[feeIndex].structure.push(newStructure);
          } else {
            classData.fee.push({ feeType: newFee.feeType, structure: [newStructure] });
          }
          return classData;
        });
      } else {
        const classIndex = updatedData.findIndex(c => c.class === newFee.className);
        if (classIndex !== -1) {
          const feeIndex = updatedData[classIndex].fee.findIndex(f => f.feeType === newFee.feeType);
          const newStructure = {
            _id: Date.now().toString(),
            title: newFee.title,
            dueDate: newFee.dueDate,
            amount: newFee.amount,
            discount: newFee.discount,
            compulsory: newFee.compulsory,
          };
      
          if (feeIndex !== -1) {
            updatedData[classIndex].fee[feeIndex].structure.push(newStructure);
          } else {
            updatedData[classIndex].fee.push({ feeType: newFee.feeType, structure: [newStructure] });
          }
        }
        return updatedData;
      }
    });
  
    setShowAddModal(false);
  };
  


  const getVisibleFees = () => {
    const classObj = feesData.find((c) => c.class === selectedClass);
    if (!classObj) return [];
    const allFees = [];

    classObj.fee.forEach((feeBlock) => {
      feeBlock.structure.forEach((fee) => {
        allFees.push({ ...fee, className: classObj.class, feeType: feeBlock.feeType });
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
            className="px-3 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {feesData.map((item) => (
              <option key={item.class} value={item.class}>
                Class {item.class}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddFee}
          >
            Add Fee
          </button>
        </div>
      </div>
      {/* Fee Table Component */}
      <FeeTable visibleFees={getVisibleFees()} onEdit={handleEdit} />
      {showAddModal && (
        <AddFeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRequest}
          onSubmit={handleAddFeeSubmit}
        />
      )}
    </div>
  );
}
