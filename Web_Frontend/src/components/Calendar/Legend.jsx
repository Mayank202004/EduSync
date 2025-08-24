const Legend = ({ legend }) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Legend</h4>
      <div className="flex flex-wrap gap-3">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color.bg, border: `2px solid ${item.color.border}` }}
            />
            <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
