import { useState } from "react";

import ConfirmModal from "../Chat/ConfirmModal";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AllergiesTable = ({ allergies = [], onDelete }) => {
  const [deleteAllergy, setDeleteAllergy] = useState(null); //store name of allergy to be deleted

  return (
    <>
      <hr className="my-6" />
      <div className="overflow-auto rounded-xl">
        <table className="min-w-full table-fixed text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="w-[5%] py-3 px-4 font-semibold text-center"></th>
              <th className="w-[95%] py-3 px-4 font-semibold">Allergy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {allergies.map((allergy) => (
              <tr key={allergy}>
                <td className="text-center">
                  <button
                    onClick={() => setDeleteAllergy(allergy)}
                    className="flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 text-red-500 hover:text-red-700 transition-colors duration-300 cursor-pointer p-1 aspect-square h-10 rounded-full"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
                <td className="px-4 py-2">{allergy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleteAllergy && (
        <ConfirmModal
          onCancel={() => setDeleteAllergy(null)}
          onConfirm={() => {
            onDelete(deleteAllergy);
            setDeleteAllergy(null);
          }}
        >
          <span>
            Are you sure you want to delete the allergy{" "}
            <strong>{deleteAllergy}</strong>
          </span>
        </ConfirmModal>
      )}
    </>
  );
};

export default AllergiesTable;
