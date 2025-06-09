import { cn } from "@/lib/utils";

/**
 * A styled input field with optional title, hints, and single error support.
 *
 * @component
 * @param {string} [props.labelStyle] - Optional classes for the label wrapper.
 * @param {string} [props.titleText] - Text displayed above the input.
 * @param {string} [props.titleStyle] - Optional classes for the title text.
 * @param {Object} [props.inputProps] - Props passed to the input field.
 * @param {string} [props.inputStyle] - Optional classes for the input.
 * @param {{text: string, style?: string}[]} [props.hints] - List of hint objects with optional per-hint styling.
 * @param {string} [props.error] - A single error message shown below the input.
 *
 * @example
 * <Input
 *   titleText="Username"
 *   inputProps={{ type: "text", name: "username" }}
 *   error="This field is required"
 * />
 */
const Input = ({
  labelStyle,
  titleText,
  titleStyle,
  inputProps,
  inputStyle,
  error,
  hints,
}) => {
  const hasError = !!error;

  return (
    <label className={cn(labelStyle)}>
      {titleText && (
        <span className={cn("font-semibold tracking-wide", titleStyle)}>
          {titleText}
        </span>
      )}
      <input
        className={cn(
          "focus:ring-1 not-focus:border p-2 w-full my-1.5 rounded-sm text-black dark:text-white",
          hasError && "border border-red-500 focus:ring-red-500",
          inputStyle
        )}
        {...inputProps}
      />
      {hasError && (
        <span className="block text-sm text-red-500">
          {"*" + error}
        </span>
      )}
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
