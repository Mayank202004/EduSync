import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SiblingsTable = ({ info }) => {
  return (
    <>
      <hr className="my-6" />
      <div className="overflow-auto rounded-xl">
        <table className="min-w-full table-fixed text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="w-[5%] py-3 px-4 font-semibold text-center"></th>
              <th className="w-[20%] py-3 px-4 font-semibold">Name</th>
              <th className="w-[15%] py-3 px-4 font-semibold">Relation</th>
              <th className="w-[10%] py-3 px-4 font-semibold">Age</th>
              <th className="w-[15%] py-3 px-4 font-semibold">
                In Same School
              </th>
              <th className="w-[15%] py-3 px-4 font-semibold">Class</th>
              <th className="w-[15%] py-3 px-4 font-semibold">Division</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {info.map((sibling, index) => (
              <tr key={index}>
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
    </>
  );
};

export default SiblingsTable;
