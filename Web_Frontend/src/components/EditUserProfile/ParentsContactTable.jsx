import { useState } from "react";

import ConfirmModal from "../Chat/ConfirmModal";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ParentsContactTable = ({ contacts = [], onDelete }) => {
  const [deleteContact, setDeleteContact] = useState(null); //store id and name of contact to be deleted

  return (
    <>
      <hr className="my-6" />
      <div className="overflow-auto rounded-xl">
        <table className="min-w-full table-fixed text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="w-[5%] py-3 px-4 font-semibold text-center"></th>
              <th className="w-[30%] py-3 px-4 font-semibold">Name</th>
              <th className="w-[25%] py-3 px-4 font-semibold">Relation</th>
              <th className="w-[40%] py-3 px-4 font-semibold">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {contacts.map((person) => (
              <tr key={person._id}>
                <td className="text-center">
                  <button
                    onClick={() =>
                      setDeleteContact({ id: person._id, name: person.name })
                    }
                    className="flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 text-red-500 hover:text-red-700 transition-colors duration-300 cursor-pointer p-1 aspect-square h-10 rounded-full"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
                <td className="px-4 py-2">{person.name}</td>
                <td className="px-4 py-2">{person.relation}</td>
                <td className="px-4 py-2">{person.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleteContact && (
        <ConfirmModal
          onCancel={() => setDeleteContact(null)}
          onConfirm={() => {
            onDelete(deleteContact.id);
            setDeleteContact(null);
          }}
        >
          <span>
            Are you sure you want to delete the contact details of{" "}
            <strong>{deleteContact.name}</strong>
          </span>
        </ConfirmModal>
      )}
    </>
  );
};

export default ParentsContactTable;
