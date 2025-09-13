import React from 'react'

function MarkList({ context, onBack }) {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* Header */}
      <h2 className="text-xl font-semibold mb-2">
        {context.exam} - {context.subject}
      </h2>
      <p className="mb-4 text-gray-600">
        Class {context.class}, Div {context.div}
      </p>

      {/* Placeholder for marks list */}
      <div className="p-4 border rounded-lg dark:border-gray-700">
        <p className="text-gray-500">
          [Marks list for <strong>{context.subject}</strong> in{" "}
          <strong>Class {context.class} Div {context.div}</strong> will appear
          here]
        </p>
      </div>
    </div>
  );
}


export default MarkList