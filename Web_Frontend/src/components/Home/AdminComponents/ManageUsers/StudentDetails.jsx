import React from "react";

function StudentDetails({ student, onBack }) {
  if (!student) return null;

  // Normalize transport value (could be "true"/"false" string or boolean)
  const transport =
    student.schoolTransport === true || student.schoolTransport === "true"
      ? "Yes"
      : "No";

  return (
    <div className="p-6 border rounded shadow bg-white dark:bg-customDarkBg dark:border-gray-700 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        {/* Avatar */}
        {student.userId?.avatar ? (
          <img
            src={student.userId.avatar}
            alt={student.userId.fullName}
            className="w-24 h-24 rounded-full border shadow"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center bg-gray-200 dark:bg-customDarkFg rounded-full text-gray-600 dark:text-gray-300 text-lg">
            {student.userId?.fullName?.charAt(0) || "?"}
          </div>
        )}

        {/* Name + Email */}
        <div>
          <h2 className="text-2xl font-bold">{student.userId?.fullName}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {student.userId?.email || "-"}
          </p>
          <span
            className={`inline-block px-2 py-1 mt-2 text-xs font-semibold rounded ${
              student.userId?.verified
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
            }`}
          >
            {student.userId?.verified ? "Verified" : "Not Verified"}
          </span>
        </div>
      </div>

      {/* IDs */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700 dark:text-gray-400">
        <p>
          <strong>Student ID:</strong> {student._id || "-"}
        </p>
        <p>
          <strong>User ID:</strong> {student.userId?._id || "-"}
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <p>
          <strong>Class:</strong> {student.class || "-"}
        </p>
        <p>
          <strong>Division:</strong> {student.div || "-"}
        </p>
        <p>
          <strong>Gender:</strong> {student.gender || "-"}
        </p>
        <p>
          <strong>DOB:</strong>{" "}
          {student.dob ? new Date(student.dob).toLocaleDateString() : "-"}
        </p>
        <p>
          <strong>Blood Group:</strong> {student.bloodGroup || "-"}
        </p>
        <p>
          <strong>Height:</strong> {student.height ? `${student.height} cm` : "-"}
        </p>
        <p>
          <strong>Weight:</strong> {student.weight ? `${student.weight} kg` : "-"}
        </p>
        <p>
          <strong>School Transport:</strong> {transport}
        </p>
        <p className="col-span-2">
          <strong>Address:</strong> {student.address || "-"}
        </p>
        <p className="col-span-2">
          <strong>Allergies:</strong>{" "}
          {student.allergies?.length ? student.allergies.join(", ") : "None"}
        </p>
      </div>

      {/* Parent Info */}
      {student.parentsInfo && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Parent Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Father:</strong> {student.parentsInfo.fatherName || "-"}
            </p>
            <p>
              <strong>Occupation:</strong>{" "}
              {student.parentsInfo.fatherOccupation || "-"}
            </p>
            <p>
              <strong>Father Income:</strong>{" "}
              {student.parentsInfo.fatherIncome
                ? `₹${student.parentsInfo.fatherIncome}`
                : "-"}
            </p>
            <p>
              <strong>Mother:</strong> {student.parentsInfo.motherName || "-"}
            </p>
            <p>
              <strong>Occupation:</strong>{" "}
              {student.parentsInfo.motherOccupation || "-"}
            </p>
            <p>
              <strong>Mother Income:</strong>{" "}
              {student.parentsInfo.motherIncome
                ? `₹${student.parentsInfo.motherIncome}`
                : "-"}
            </p>
          </div>
        </div>
      )}

      {/* Parent Contact */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Parent Contacts</h3>
        {student.parentContact?.length ? (
          <ul className="list-disc pl-6 space-y-1">
            {student.parentContact.map((p, idx) => (
              <li key={idx}>
                {p.name} ({p.relation}) – {p.phone}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No contacts available
          </p>
        )}
      </div>

      {/* Sibling Info */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Siblings</h3>
        {student.siblingInfo?.length ? (
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-customDarkFg">
              <tr>
                <th className="border p-2 text-left dark:border-gray-600">
                  Name
                </th>
                <th className="border p-2 text-left dark:border-gray-600">
                  Age
                </th>
                <th className="border p-2 text-left dark:border-gray-600">
                  Relation
                </th>
                <th className="border p-2 text-left dark:border-gray-600">
                  Same School
                </th>
                <th className="border p-2 text-left dark:border-gray-600">
                  Class
                </th>
                <th className="border p-2 text-left dark:border-gray-600">
                  Div
                </th>
              </tr>
            </thead>
            <tbody>
              {student.siblingInfo.map((s, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-customDarkFg"
                >
                  <td className="border p-2 dark:border-gray-600">{s.name}</td>
                  <td className="border p-2 dark:border-gray-600">{s.age}</td>
                  <td className="border p-2 dark:border-gray-600">
                    {s.relation}
                  </td>
                  <td className="border p-2 dark:border-gray-600">
                    {s.isInSameSchool ? "Yes" : "No"}
                  </td>
                  <td className="border p-2 dark:border-gray-600">
                    {s.class || "-"}
                  </td>
                  <td className="border p-2 dark:border-gray-600">
                    {s.div || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No siblings info</p>
        )}
      </div>
    </div>
  );
}

export default StudentDetails;
