import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AllergiesTable = ({ allergies = [], onDelete = () => {} }) => {
  return (
    <>
      <hr className="my-6" />
      <div className="container flex flex-nowrap items-center gap-2 mb-3">
        <div className="w-full">
          <table className="min-w-full text-left text-sm border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-2 py-2 w-10"></th>
                <th className="px-4 py-2">Allergy</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {allergies.map((allergy) => (
                <tr
                  key={allergy}
                  className="transition-colors duration-300 group"
                >
                  <td className="text-center transition-opacity duration-300 md:invisible md:group-hover:visible">
                    <button
                      onClick={() => onDelete(allergy)}
                      className="flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 text-red-500 hover:text-red-700 cursor-pointer p-1 aspect-square h-10 rounded-full"
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
      </div>
    </>
  );
};

export default AllergiesTable;
