const modeColors = {
  green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  red: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  blue: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  yellow:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const Tag = ({ text, color }) => (
  <span
    className={`px-3 py-1 mx-2 text-sm rounded-full font-medium ${modeColors[color]}`}
  >
    {text}
  </span>
);

export default Tag;