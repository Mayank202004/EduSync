import { cn } from "@/lib/utils";

/**
 * A styled input field with optional title and per-hint customization.
 *
 * @component
 * @param {string} [props.labelStyle] - Optional classes for the label wrapper.
 * @param {string} [props.titleText] - Text displayed above the input.
 * @param {string} [props.titleStyle] - Optional classes for the title text.
 * @param {Object} [props.inputProps] - Props passed to the input field.
 * @param {string} [props.inputStyle] - Optional classes for the input.
 * @param {{text: string, style?: string}[]} [props.hints] - List of hint objects with optional per-hint styling.
 *
 * @example
 * <Input
 *   titleText="Username"
 *   inputProps={{ type: "text", name: "username" }}
 *   hints={[
 *     { text: "Must be at least 6 characters." },
 *     { text: "No special characters.", style: "text-red-500" }
 *   ]}
 * />
 */
const Input = ({
  labelStyle,
  titleText,
  titleStyle,
  inputProps,
  inputStyle,
  hints,
}) => {
  return (
    <label className={cn(labelStyle)}>
      {titleText && (
        <span className={cn("font-bold", titleStyle)}>{titleText}</span>
      )}
      <input
        className={cn(
          "focus:ring-1 not-focus:border p-2 w-full my-1.5 rounded-sm text-black dark:text-white",
          inputStyle
        )}
        {...inputProps}
      />
      {hints?.map((hint, index) => (
        <span
          key={index}
          className={cn(
            "block leading-4.5 text-gray-500 dark:text-gray-400",
            hint.style
          )}
        >
          {hint.text}
        </span>
      ))}
    </label>
  );
};

export default Input;
