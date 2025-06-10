import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SiblingsTable = ({ info }) => {
  return (
    <>
      <hr className="my-6" />
      <div className="container w-full flex flex-nowrap items-center gap-2 mb-3">
        <div className="max-w-full overflow-x-scroll md:overflow-x-hidden">
          <table className="w-max md:min-w-full md:w-full table-fixed md:tablet-auto text-left text-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-2 py-2 w-10"></th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Relation</th>
                <th className="px-4 py-2">Age</th>
                <th className="px-4 py-2">In Same School</th>
                <th className="px-4 py-2">Class</th>
                <th className="px-4 py-2">Division</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {info.map((sibling, index) => (
                <tr
                  key={index}
                >
                  <td className="text-center">
                    <button
                      onClick={() => {}}
                      className="flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 text-red-500 hover:text-red-700 transition-colors duration-300 cursor-pointer p-1 aspect-square h-10 rounded-full"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                  <td className="px-4 py-2">{sibling.name}</td>
                  <td className="px-4 py-2">{sibling.relation}</td>
                  <td className="px-4 py-2">{sibling.age}</td>
                  <td className="px-4 py-2">
                    {sibling.isInSameSchool ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">
                    {sibling.isInSameSchool ? sibling.class : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {sibling.isInSameSchool ? sibling.div : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SiblingsTable;
