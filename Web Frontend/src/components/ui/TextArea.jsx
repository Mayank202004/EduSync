import { cn } from "@/lib/cn";

/**
 * A styled textarea field with optional title, hints, and single error support.
 *
 * @component
 * @param {string} [props.labelStyle] - Optional classes for the label wrapper.
 * @param {string} [props.titleText] - Text displayed above the textArea.
 * @param {string} [props.titleStyle] - Optional classes for the title text.
 * @param {Object} [props.textAreaProps] - Props passed to the textArea field.
 * @param {string} [props.textAreaStyle] - Optional classes for the textArea.
 * @param {{text: string, style?: string}[]} [props.hints] - List of hint objects with optional per-hint styling.
 * @param {string} [props.error] - A single error message shown below the textArea.
 *
 * @example
 * <Input
 *   titleText="Username"
 *   textAreaProps={{ type: "text", name: "username" }}
 *   error="This field is required"
 * />
 */
const TextArea = ({
  labelStyle,
  titleText,
  titleStyle,
  textAreaProps,
  textAreaStyle,
  error,
  hints,
}) => {
  return (
    <label className={cn(labelStyle)}>
      {titleText && (
        <span className={cn("font-semibold tracking-wide", titleStyle)}>
          {titleText}
        </span>
      )}
      <textarea
        className={cn(
          "resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 not-focus:border p-2 w-full mt-1 mb-1.5 rounded-sm text-black dark:text-white",
          textAreaStyle,
          error && "border border-red-500 focus:ring-red-500"
        )}
        {...textAreaProps}
      ></textarea>
      {error && (
        <span className="block text-sm text-red-500 leading-4.5">
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

export default TextArea;
