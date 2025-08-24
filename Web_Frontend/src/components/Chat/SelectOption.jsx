import { cn } from "@/lib/cn";

const SelectOption = ({
  selectProps = {},
  selectStyle = "",
  optionStyle = "",
  options = [],
  title,
  titleStyle = "",
  containerStyle = "",
  nostyle=false
}) => {
  return (
    <div className={cn("flex w-fit gap-4 items-center mb-1.5", containerStyle)}>
      {title && <label className={cn("font-semibold", titleStyle)}>{title}</label>}
      <select
        {...selectProps}
        className={cn(
          !nostyle && "w-fit p-2 pe-5 bg-blue-300 dark:bg-blue-700/50 rounded-sm",
          selectStyle
        )}
      >
        {options.map(({ value, text, disabled = false }) => (
          <option
            disabled={disabled}
            key={value}
            value={value}
            className={cn("bg-white dark:bg-customDarkFg", optionStyle)}
          >
            {text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOption;
