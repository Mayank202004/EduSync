import React, { useState } from "react";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import Modal from "@/components/Modals/Modal";
import toast from "react-hot-toast";
import { registerTeacherBySuperAdmin } from "@/services/dashboardService";

const AddTeacherForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    position: "",
    subjects: [],
    classTeacher: null,
    classCoordinator: null,
    phone: "",
    address: "",
    role: "teacher",
  });

  const [showModal, setShowModal] = useState(false);

  const teacherPositions = ["PGT", "TGT", "PRT", "Sports Teacher", "Principal", "Vice Principal", "Music Teacher", "Art Teacher"];

  // --- Handle simple input fields ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  // --- Subject Management ---
  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { name: "", classes: [] }],
    }));
  };

  const removeSubject = (sIndex) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== sIndex),
    }));
  };

  const handleSubjectChange = (sIndex, value) => {
    const updated = [...formData.subjects];
    updated[sIndex].name = value;
    setFormData((prev) => ({ ...prev, subjects: updated }));
  };

  const addClassToSubject = (sIndex) => {
    const updated = [...formData.subjects];
    updated[sIndex].classes.push({ class: "", div: [] });
    setFormData((prev) => ({ ...prev, subjects: updated }));
  };

  const handleClassChange = (sIndex, cIndex, value) => {
    const updated = [...formData.subjects];
    updated[sIndex].classes[cIndex].class = value;
    setFormData((prev) => ({ ...prev, subjects: updated }));
  };

  const addDivToClass = (sIndex, cIndex) => {
    const updated = [...formData.subjects];
    updated[sIndex].classes[cIndex].div.push("");
    setFormData((prev) => ({ ...prev, subjects: updated }));
  };

  const removeClassFromSubject = (sIndex, cIndex) => {
    const updated = [...formData.subjects];
    updated[sIndex].classes = updated[sIndex].classes.filter((_, i) => i !== cIndex);
    setFormData((prev) => ({ ...prev, subjects: updated }));
  };

  const removeDivFromClass = (sIndex, cIndex, dIndex) => {
    const updated = [...formData.subjects];
    updated[sIndex].classes[cIndex].div = updated[sIndex].classes[cIndex].div.filter(
      (_, i) => i !== dIndex
    );
    setFormData((prev) => ({ ...prev, subjects: updated }));
  };



  const handleDivChange = (sIndex, cIndex, dIndex, value) => {
    const updated = [...formData.subjects];
    updated[sIndex].classes[cIndex].div[dIndex] = value;
    setFormData((prev) => ({ ...prev, subjects: updated }));
  };

  // --- Submit Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // clean payload for null values
    const cleanedFormData = {
      ...formData,
      classTeacher:
        formData.classTeacher &&
        (formData.classTeacher.class || formData.classTeacher.div)
          ? formData.classTeacher
          : null,
      classCoordinator: formData.classCoordinator || null,
    };

    setFormData(cleanedFormData);
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    try{
      const response = await toast.promise(
        registerTeacherBySuperAdmin(formData),
        {
          loading: "Registering Teacher...",
          success: "Teacher registered successfully",
          error: "", // handled by interceptor
        }
      )
    } catch(err){
      // Handled by axios interceptor
    }
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={18} /> Back to Manage Users
      </button>

      <div className="bg-white dark:bg-customDarkFg rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ""}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <select
              name="position"
              value={formData.position || ""}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">Select Position (Optional)</option>
              {teacherPositions.map((pos, index) => (
                <option key={index} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="phone"
              placeholder="Phone (Optional)"
              value={formData.phone || ""}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address (Optional)"
              value={formData.address || ""}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          {/* Class Teacher Toggle */}
          <div className="border p-3 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.classTeacher}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    classTeacher: e.target.checked ? { class: "", div: "" } : null,
                  }))
                }
              />
              <span className="font-semibold">Assign as Class Teacher</span>
            </label>

            {formData.classTeacher && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <input
                  type="text"
                  placeholder="Class (e.g. 9)"
                  value={formData.classTeacher.class || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      classTeacher: { ...prev.classTeacher, class: e.target.value },
                    }))
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Division (e.g. A)"
                  value={formData.classTeacher.div || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      classTeacher: { ...prev.classTeacher, div: e.target.value },
                    }))
                  }
                  className="p-2 border rounded"
                />
              </div>
            )}
          </div>

          {/* Class Coordinator Toggle */}
          <div className="border p-3 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.classCoordinator !== null}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    classCoordinator: e.target.checked ? "" : null,
                  }))
                }
              />
              <span className="font-semibold">Assign as Class Coordinator</span>
            </label>

            {formData.classCoordinator !== null && (
              <input
                type="text"
                placeholder="Class Coordinator for Class"
                value={formData.classCoordinator || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    classCoordinator: e.target.value,
                  }))
                }
                className="p-2 border rounded mt-3 w-full"
              />
            )}
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Subjects
              <button
                type="button"
                onClick={addSubject}
                className="text-green-600 hover:text-green-800"
              >
                <PlusCircle size={20} />
              </button>
            </h3>

            <div className="space-y-4 mt-3">
              {formData.subjects.map((subject, sIndex) => (
                <div
                  key={sIndex}
                  className="p-3 border rounded-lg bg-gray-50 dark:bg-customDarkFg"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(sIndex, e.target.value)}
                      className="p-2 border rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubject(sIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => addClassToSubject(sIndex)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      + Class
                    </button>
                  </div>

                  {/* Classes inside Subject */}
                  <div className="pl-6 mt-2 space-y-2">
                    {subject.classes.map((cls, cIndex) => (
                      <div
                        key={cIndex}
                        className="p-2 border rounded bg-white dark:bg-customDarkFg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          {/* Class input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Class"
                              value={cls.class}
                              onChange={(e) => handleClassChange(sIndex, cIndex, e.target.value)}
                              className="p-2 border rounded"
                              />

                            {/* Add Division button */}
                            <button
                              type="button"
                              onClick={() => addDivToClass(sIndex, cIndex)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              + Div
                            </button>
                          </div>

                          {/* Delete Class button */}
                          <button
                            type="button"
                            onClick={() => removeClassFromSubject(sIndex, cIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Divisions inside Class */}
                        <div className="pl-6 flex gap-2 flex-wrap">
                          {cls.div.map((d, dIndex) => (
                            <div key={dIndex} className="flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="Div"
                                value={d}
                                onChange={(e) =>
                                  handleDivChange(sIndex, cIndex, dIndex, e.target.value)
                                }
                                className="p-2 border rounded w-16"
                              />

                              {/* Delete Division button */}
                              <button
                                type="button"
                                onClick={() => removeDivFromClass(sIndex, cIndex, dIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <Modal title="Confirm Teacher Details" onClose={() => setShowModal(false)}>
          <div className="space-y-3 text-base sm:text-lg">
            <p>
              <strong>Name:</strong> {formData.fullName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Username:</strong> {formData.username}
            </p>
            {formData.position && (
              <p>
                <strong>Position:</strong> {formData.position}
              </p>
            )}
            {formData.phone && (
              <p>
                <strong>Phone:</strong> {formData.phone}
              </p>
            )}
            {formData.address && (
              <p>
                <strong>Address:</strong> {formData.address}
              </p>
            )}
            {formData.classTeacher && (
              <p>
                <strong>Class Teacher:</strong>{" "}
                {formData.classTeacher.class}-{formData.classTeacher.div}
              </p>
            )}
            {formData.classCoordinator && (
              <p>
                <strong>Class Coordinator:</strong> {formData.classCoordinator}
              </p>
            )}
            {formData.subjects.length > 0 && (
              <div>
                <strong>Subjects:</strong>
                <ul className="list-disc pl-6">
                  {formData.subjects.map((sub, i) => (
                    <li key={i}>
                      {sub.name} →{" "}
                      {sub.classes.map(
                        (cls, j) => `${cls.class}(${cls.div.join(",")}) `
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm & Submit
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AddTeacherForm;
