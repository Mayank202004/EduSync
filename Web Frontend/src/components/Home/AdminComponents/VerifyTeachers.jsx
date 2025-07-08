import React, { useEffect, useState } from "react";
import { fetchUnverifiedTeachers, verifyTeacher } from "@/services/dashboardService";
import AvatarIcon from "@/components/Chat/AvatarIcon";
import toast from "react-hot-toast";

const VerifyTeachers = ({ onBackPressed }) => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null); // Track teacher being confirmed

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetchUnverifiedTeachers();
        setTeachers(response.data);
      } catch (err) {
        // Error handled by Axios interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleVerify = async (teacherId) => {
    setConfirmingId(teacherId); // open confirmation dialog
  };

  const confirmVerification = async (teacherId) => {
    toast.promise(
      verifyTeacher(teacherId),
      {
        loading: "Verifying teacher...",
        success: "Teacher verified successfully!",
        error: "",
      }
    ).then(() => {
      setTeachers((prev) => prev.filter((t) => t._id !== teacherId));
    }).finally(() => {
      setConfirmingId(null);
    });
  };

  const filteredTeachers = teachers.filter((t) =>
    `${t.fullName} ${t.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Verify Teachers</h2>
        <button
          onClick={onBackPressed}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-customDarkFg text-gray-800 dark:text-white"
          placeholder="Search teachers..."
        />
        {searchTerm && (
          <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-customDarkFg border border-gray-300 dark:border-gray-700 rounded shadow-md">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((t) => (
                <div
                  key={t._id}
                  className="px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-default"
                >
                  <strong>{t.fullName}</strong>
                  <br />
                  <span className="text-xs">{t.email}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No matching teachers
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loader */}
      {loading ? (
        <SkeletonVerifyCard />
      ) : teachers.length === 0 ? (
        <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
          All teachers are already verified!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher._id}
              className="p-4 rounded-xl bg-white dark:bg-customDarkFg border border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4 mb-3">
                <AvatarIcon user={teacher} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {teacher.fullName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleVerify(teacher._id)}
                className="text-sm px-3 py-1 mt-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Verify
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-customDarkFg p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Verification
            </h3>
            {(() => {
              const teacher = teachers.find((t) => t._id === confirmingId);
              return (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    <span className="font-medium text-gray-800 dark:text-white">Name:</span>{" "}
                    {teacher?.fullName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    <span className="font-medium text-gray-800 dark:text-white">Email:</span>{" "}
                    {teacher?.email}
                  </p>
                </>
              );
            })()}
            <p className="text-gray-700 dark:text-gray-400 mb-6">
              Are you sure you want to verify this teacher?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmingId(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmVerification(confirmingId)}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Skeleton while loading
const SkeletonVerifyCard = () => {
  const skeletons = Array.from({ length: 6 }).map((_, idx) => (
    <div
      key={idx}
      className="p-4 rounded-xl bg-white dark:bg-customDarkFg border border-gray-200 dark:border-gray-700 shadow animate-pulse"
    >
      <div className="flex items-center space-x-4 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="h-8 w-20 bg-green-200 dark:bg-green-700 rounded" />
    </div>
  ));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {skeletons}
    </div>
  );
};


export default VerifyTeachers;
