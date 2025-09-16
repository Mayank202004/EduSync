import React, { useEffect, useState } from "react";
import {
  fetchAllClasses,
  addClass,
  deleteClass,
  addDivision,
  deleteDivision,
} from "@/services/dashboardService";
import Modal from "@/components/Modals/Modal";
import { Trash, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const ManageClasses = ({ onBackPressed }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [selectedClassName, setSelectedClassName] = useState(null);
  const [newDivision, setNewDivision] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAllClasses();
        setClasses(res.data || []);
      } catch {
        // handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddClass = async () => {
    if (!newClassName.trim()) {
      toast.error("Class name cannot be empty.");
      return;
    }
    try {
      const response = await toast.promise(
        addClass(newClassName),
        {
          loading: "Adding class...",
          success: "Class added successfully!",
          error: "",
        }
      );
      setClasses((prev) => [...prev, response.data]);
    } catch (err) {
      // Error handled by toast.promise
    } finally {
      setNewClassName("");
      setShowModal(false);
    }
  };

  const handleDeleteClass = async (className) => {
  try {
    await toast.promise(
      deleteClass(className),
      {
        loading: "Deleting class...",
        success: "Class deleted.",
        error: "",
      }
    );
    setClasses((prev) => prev.filter((c) => c.className !== className));
  } catch (err) {
    // error toast already handled by toast.promise
  }
};


  const handleAddDivision = async () => {
  if (!newDivision.trim() || !selectedClassName) {
    toast.error("Division or class missing.");
    return;
  }

  try {
    await toast.promise(
      addDivision(selectedClassName, newDivision),
      {
        loading: "Adding division...",
        success: "Division added.",
        error: "",
      }
    );

    setClasses((prev) =>
      prev.map((cls) =>
        cls.className === selectedClassName
          ? { ...cls, divisions: [...cls.divisions, newDivision] }
          : cls
      )
    );
  } catch {
    // Error toast already shown by toast.promise
  } finally {
    setNewDivision("");
    setSelectedClassName(null);
    setShowModal(false);
  }
};


  const handleDeleteDivision = async (className, division) => {
    try {
      await toast.promise(
        deleteDivision(className, division),
        {
          loading: "Deleting division...",
          success: "Division removed.",
          error: "",
        }
      );
      setClasses((prev) =>
        prev.map((cls) =>
          cls.className === className
            ? { ...cls, divisions: cls.divisions.filter((d) => d !== division) }
            : cls
        )
      );
    } catch {
      // Error already handled by toast.promise
    }
  };


  return (
    <div className="text-gray-900 dark:text-white overflow-y-auto h-[calc(100%-30px)] my-5 w-full px-2">
      <button
          onClick={onBackPressed}
          className="flex items-center gap-2 text-blue-600 hover:underline mb-6 mt-3"
        >
          <ArrowLeft size={18} /> Back
      </button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Classes & Divisions</h2>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => {
            setShowModal("class");
            setNewClassName("");
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Class
        </button>
        <button
          onClick={() => {
            setShowModal("division");
            setSelectedClassName(classes[0]?.className || "");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Division
        </button>
      </div>

      {loading ? (
        <p>Loading classes...</p>
      ) : classes.length === 0 ? (
        <p>No classes available.</p>
      ) : (
        classes.map((cls) => (
          <div
            key={cls.className}
            className="mb-6 p-5 rounded-xl dark:border-gray-700 bg-white dark:bg-customDarkFg"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Class {cls.className}
              </h3>
              <button
                onClick={() => handleDeleteClass(cls.className)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
            {cls.divisions.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {cls.divisions.map((div, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 rounded-full shadow-sm"
                  >
                    Div {div}
                    <button
                      onClick={() => handleDeleteDivision(cls.className, div)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No divisions yet</p>
            )}
          </div>
        ))
      )}

      {/* Modal for Add Class */}
      {showModal === "class" && (
        <Modal title="Add New Class" onClose={() => setShowModal(false)}>
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded"
            placeholder="Enter class name (e.g., 6)"
          />
          <button
            onClick={handleAddClass}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Class
          </button>
        </Modal>
      )}

      {/* Modal for Add Division */}
      {showModal === "division" && (
        <Modal title="Add New Division" onClose={() => setShowModal(false)}>
          <select
            value={selectedClassName}
            onChange={(e) => setSelectedClassName(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded"
          >
            {classes.map((cls) => (
              <option key={cls.className} value={cls.className}>
                Class {cls.className}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newDivision}
            onChange={(e) => setNewDivision(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded"
            placeholder="Enter division name (e.g., A)"
          />
          <button
            onClick={handleAddDivision}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Division
          </button>
        </Modal>
      )}
    </div>
  );
};



export default ManageClasses;
