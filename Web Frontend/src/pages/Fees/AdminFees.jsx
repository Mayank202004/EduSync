import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import FeeTable from "@/components/Fees/AdminComponents/FeeTable";
import { formatDate } from "@/utils/utils.js";
import AddFeeModal from "@/components/Fees/AdminComponents/AddFeeModal";
import { getAllFees } from "@/services/feeService";
import AdminFeesSkeleton from "@/components/Fees/AdminComponents/feeSkeleton";



export default function AdminFees() {
    // Hooks
  const [feesData, setFeesData] = useState(null);
  const [selectedClass, setSelectedClass] = useState("1");
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch All Fee structures
  useEffect(() => {
      const fetchFeesData = async () => {
        try {
          const response = await getAllFees();
          setFeesData(response.data);
        } catch (error) {
          // handled by axios interceptor
        }
      };
      fetchFeesData();
    }, []);

  const handleEdit = (item) => {
    // To Do : 
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
  


 const getFeesByType = () => {
  const classObj = feesData?.find((c) => c.class === selectedClass);
  if (!classObj) return {};

  const grouped = {};

  classObj.fee.forEach((feeBlock) => {
    const type = feeBlock.feeType;
    if (!grouped[type]) grouped[type] = [];

    feeBlock.structure.forEach((fee) => {
      grouped[type].push({ ...fee, className: classObj.class, feeType: type });
    });
  });

  return grouped; // { "Tuition": [...], "Transport": [...], ... }
};


  // if (!feesData) return <AdminFeesSkeleton />;
  const groupedFees = getFeesByType();
  return (
    <>
      {/* Skeleton */}
      <div
        className={`absolute top-0 left-0 w-full transition-opacity duration-500 ${!feesData ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <AdminFeesSkeleton />
      </div>
      <div className={`p-6 bg-gray-50 dark:bg-gray-900 min-h-screen w-full transition-opacity duration-700 ${!feesData ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Fees Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {feesData?.map((item) => (
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

        {Object.entries(groupedFees).map(([type, fees]) => (
          <div key={type}>
            <h2 className="text-xl font-bold my-4">{type} Fees</h2>
            <FeeTable visibleFees={fees} onEdit={handleEdit} />
          </div>
        ))}

        {showAddModal && (
          <AddFeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRequest}
          onSubmit={handleAddFeeSubmit}
          />
        )}
      </div>
    </>
  );
}
