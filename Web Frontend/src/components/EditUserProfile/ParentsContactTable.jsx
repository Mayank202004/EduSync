import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ParentsContactTable = ({ contacts = [], onDelete = () => {} }) => {
  return (
    <>
      <hr className="my-6" />
      <div className="container flex flex-nowrap items-center gap-2 mb-3">
        <div className="w-full">
          <table className="min-w-full text-left text-sm border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-2 py-2 w-10"></th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Relation</th>
                <th className="px-4 py-2">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {contacts.map((person) => (
                <tr
                  key={person._id}
                  className="transition-colors duration-300 group"
                >
                  <td className="text-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => onDelete(person._id)}
                      className="flex items-center justify-center invisible group-hover:visible hover:bg-gray-300 dark:hover:bg-gray-600 text-red-500 hover:text-red-700 cursor-pointer p-1 aspect-square h-10 rounded-full"
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
      </div>
    </>
  );
};

export default ParentsContactTable;
