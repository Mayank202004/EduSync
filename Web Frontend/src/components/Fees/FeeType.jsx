const FeeType = ({ type, children }) => {
  return (
    <ul className="my-8 py-2 mx-auto border-1 relative rounded-md p-4 pt-6">
      <span class="absolute -top-4 left-4 px-2 bg-customLightBg dark:bg-customDarkBg text-xl text-gray-600 dark:text-gray-400 font-medium">
        {type}
      </span>
      {children}
    </ul>
  );
};

export default FeeType;
