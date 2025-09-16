import React, { useEffect, useState } from "react";
import { Trash, Pencil, ArrowLeft, Save, Plus } from "lucide-react";
import Modal from "@/components/Modals/Modal";
import toast from "react-hot-toast";
import { fetchAllTeachers, updateTeacherSubjects} from "@/services/dashboardService";

const classOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const subjectOptions = ["English", "Maths", "Science", "History", "Geography"];
const divisionOptions = ["A", "B", "C", "D", "E"];

const ManageTeacherSubjects = ({ onBackPressed }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [modal, setModal] = useState({ open: false, type: null, payload: {} });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetchAllTeachers();
        setTeachers(response.data);
      } catch (err) {
        // Error handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const updateTeachers = (teacherId, updater) => {
    setTeachers(prev =>
      prev.map(t => (t._id === teacherId ? updater(t) : t))
    );
  };

  const handleAddSubject = (teacherId, subjectName) => {
    if (!subjectName) return;
    updateTeachers(teacherId, t => ({
      ...t,
      subjects: [...t.subjects, {  name: subjectName, classes: [] }],
    }));
  };

  const handleAddClass = (teacherId, subjectName, className) => {
    if (!className) return;
    updateTeachers(teacherId, t => ({
      ...t,
      subjects: t.subjects.map(s =>
        s.name === subjectName
          ? {
              ...s,
              classes: [...s.classes, { class: className, div: [] }],
            }
          : s
      ),
    }));
  };

  const handleAddDivision = (teacherId, subjectName, className, divName) => {
    if (!divName) return;
    updateTeachers(teacherId, t => ({
      ...t,
      subjects: t.subjects.map(s =>
        s.name === subjectName
          ? {
              ...s,
              classes: s.classes.map(c =>
                c.class === className && !c.div.includes(divName)
                  ? { ...c, div: [...c.div, divName] }
                  : c
              ),
            }
          : s
      ),
    }));
  };

  const filteredTeachers = teachers.filter(t =>
    t.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * @desc Finalize changes and call backend 
   * @param {String} teacherId 
   */
  const handleSaveTeacherChanges = async (teacherId) => {
    const teacherToUpdate = teachers.find(teacher => teacher._id === teacherId);
    if (!teacherToUpdate) return;

    const promise = updateTeacherSubjects(
      teacherToUpdate._id,
      teacherToUpdate.position,
      teacherToUpdate.subjects,
      teacherToUpdate.classTeacher || null,
      teacherToUpdate.classCoordinator || null
    );

    toast.promise(promise, {
      loading: "Saving changes...",
      success: "Changes saved successfully!",
      error: "",
    });

    try {
      await promise;
      setEditTeacherId(null);
    } catch (err) {
      // Error handled globally
    }
  };


  return (
    <div className="text-gray-900 dark:text-white overflow-y-auto h-[calc(100%-30px)] my-5 w-full px-2">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackPressed}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <input
          type="text"
          placeholder="Search teacher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTeachers.map(t => (
            <div
              key={t._id}
              className="bg-white dark:bg-customDarkFg p-4 rounded-2xl shadow min-h-[300px] flex flex-col justify-between"
            >
              {/* Teacher Info */}
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {t.userId.fullName} ({t.position})
                    </h3>
                    {editTeacherId === t._id ? (
                      <div className="flex flex-col gap-2 mt-2">
                        {/* Class Teacher */}
                        <label className="text-sm font-medium w-[120px]">Class Teacher:</label>
                        <div className="flex gap-2 items-center">
                          <select
                            className="px-2 py-1 border rounded dark:bg-gray-800"
                            value={t.classTeacher?.class || ""}
                            onChange={(e) =>
                              updateTeachers(t._id, tt => ({
                                ...tt,
                                classTeacher: {
                                  ...(tt.classTeacher || {}),
                                  class: e.target.value,
                                  div: tt.classTeacher?.div || divisionOptions[0],
                                },
                              }))
                            }
                          >
                            <option value="">Select Class</option>
                            {classOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          
                          <select
                            className="px-2 py-1 border rounded dark:bg-gray-800"
                            value={t.classTeacher?.div || ""}
                            onChange={(e) =>
                              updateTeachers(t._id, tt => ({
                                ...tt,
                                classTeacher: {
                                  ...(tt.classTeacher || {}),
                                  class: tt.classTeacher?.class || classOptions[0],
                                  div: e.target.value,
                                },
                              }))
                            }
                          >
                            <option value="">Select Division</option>
                            {divisionOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          
                          {/* ❌ Clear Class Teacher */}
                          <button
                            className="text-red-500 text-xs underline"
                            onClick={() =>
                              updateTeachers(t._id, tt => ({
                                ...tt,
                                classTeacher: null,
                              }))
                            }
                          >
                            Clear
                          </button>
                        </div>
                          
                        {/* Class Coordinator */}
                        <label className="text-sm font-medium w-[120px]">Class Coordinator:</label>
                        <div className="flex gap-2 items-center">
                          <select
                            className="px-2 py-1 border rounded dark:bg-gray-800"
                            value={t.classCoordinator || ""}
                            onChange={(e) =>
                              updateTeachers(t._id, tt => ({
                                ...tt,
                                classCoordinator: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Class</option>
                            {classOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          
                          {/* ❌ Clear Coordinator */}
                          <button
                            className="text-red-500 text-xs underline"
                            onClick={() =>
                              updateTeachers(t._id, tt => ({
                                ...tt,
                                classCoordinator: "",
                              }))
                            }
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {t.classTeacher && (
                          <p className="text-sm"><span className="font-semibold">Class Teacher:</span> {t.classTeacher.class} - {t.classTeacher.div}</p>
                        )}
                        {t.classCoordinator && (
                          <p className="text-sm"><span className="font-semibold">Class Coordinator:</span> {t.classCoordinator}</p>
                        )}
                      </>
                    )}
                    

                  </div>
                  <button onClick={() => setEditTeacherId(t._id)} className="text-blue-600">
                    <Pencil size={18} />
                  </button>
                </div>

                {/* Add Subject */}
                {editTeacherId === t._id && (
                  <button
                    onClick={() => setModal({ open: true, type: "subject", payload: { teacherId: t._id } })}
                    className="mt-2 text-sm text-green-600 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Subject
                  </button>
                )}

                {/* Subject Blocks */}
                {t.subjects.length > 0 ? (
                  t.subjects.map(subject => (
                    <div key={subject._id} className="border rounded p-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-700">{subject.name}</span>
                        {editTeacherId === t._id && (
                          <button
                            onClick={() => updateTeachers(t._id, tt => ({
                              ...tt,
                              subjects: tt.subjects.filter(s => s.name !== subject.name),
                            }))}
                            className="text-red-500"
                          >
                            <Trash size={16} />
                          </button>
                        )}
                      </div>

                      {/* Class + Divisions */}
                      {subject.classes.map(cls => (
                        <div key={cls._id} className="ml-4 mt-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Class {cls.class}</span>
                            {editTeacherId === t._id && (
                              <button
                                onClick={() => updateTeachers(t._id, tt => ({
                                  ...tt,
                                  subjects: tt.subjects.map(s =>
                                    s.name === subject.name
                                      ? { ...s, classes: s.classes.filter(c => c.class !== cls.class) }
                                      : s
                                  ),
                                }))}
                                className="text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {cls.div.map((d, i) => (
                              <span key={i} className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {d}
                                {editTeacherId === t._id && (
                                  <button
                                    onClick={() =>
                                      updateTeachers(t._id, tt => ({
                                        ...tt,
                                        subjects: tt.subjects.map(s =>
                                          s.name === subject.name
                                            ? {
                                                ...s,
                                                classes: s.classes.map(c =>
                                                  c.class === cls.class
                                                    ? { ...c, div: c.div.filter(x => x !== d) }
                                                    : c
                                                ),
                                              }
                                            : s
                                        ),
                                      }))
                                    }
                                    className="text-red-500"
                                  >
                                    <Trash size={12} />
                                  </button>
                                )}
                              </span>
                            ))}
                            {editTeacherId === t._id && (
                              <button
                                onClick={() =>
                                  setModal({
                                    open: true,
                                    type: "div",
                                    payload: {
                                      teacherId: t._id,
                                      subjectName: subject.name,
                                      className: cls.class,
                                    },
                                  })
                                }
                                className="flex items-center gap-1 text-green-600 text-sm px-3 py-1 rounded-full border border-green-600"
                              >
                                <Plus size={12} /> Add Div
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add Class Button */}
                      {editTeacherId === t._id && (
                        <button
                          onClick={() =>
                            setModal({ open: true, type: "class", payload: { teacherId: t._id, subjectName: subject.name } })
                          }
                          className="mt-2 ml-4 text-green-600 text-sm pt-3 flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Class
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No subjects assigned</p>
                )}
              </div>

              {editTeacherId === t._id && (
                <button
                  onClick={() => {
                    handleSaveTeacherChanges(t._id);
                  }}
                  className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  <Save size={16} className="inline mr-2" /> Save Changes
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Logic */}
      {modal.open && (
        <Modal title={`Add ${modal.type}`} onClose={() => setModal({ open: false, type: null, payload: {} })}>
          <div className="space-y-4">
            <select
              className="w-full px-3 py-2 border rounded dark:bg-gray-800"
              onChange={(e) => {
                const value = e.target.value;
                const { teacherId, subjectName, className } = modal.payload;
                if (modal.type === "subject") {
                  handleAddSubject(teacherId, value);
                } else if (modal.type === "class") {
                  handleAddClass(teacherId, subjectName, value);
                } else if (modal.type === "div") {
                  handleAddDivision(teacherId, subjectName, className, value);
                }
                setModal({ open: false, type: null, payload: {} });
              }}
              defaultValue=""
            >
              <option value="" disabled>Select {modal.type}</option>
              {(modal.type === "subject" ? subjectOptions :
                modal.type === "class" ? classOptions :
                divisionOptions
              ).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageTeacherSubjects;
