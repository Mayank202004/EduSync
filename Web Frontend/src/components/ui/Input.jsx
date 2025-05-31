import { cn } from "@/lib/utils";

/**
 * A styled input field with optional title and hints, useful for forms.
 *
 * @component
 * @param {string} [props.titleText] - The label text displayed above the input field.
 * @param {string} [props.titleStyles] - Optional CSS classes for customizing the label style.
 * @param {Object} [props.inputProps] - Props forwarded directly to the <input> element (e.g., name, type, placeholder, onChange).
 * @param {string} [props.inputStyle] - Optional CSS classes for customizing the input field style.
 * @param {string[]} [props.hints] - An array of hint strings displayed below the input.
 * @param {string} [props.hintStyle] - Optional CSS classes to style the hints.
 * Supports style merging using {@link https://github.com/lukeed/clsx | clsx} and {@link https://github.com/dcastil/tailwind-merge | tailwind-merge}
 * 
 * @example
 * <Input
 *   titleText="Email"
 *   inputProps={{ type: "email", placeholder: "you@example.com", required: true }}
 *   hints={["We'll never share your email."]}
 * />
 */
const Input = ({
  titleText,
  titleStyles,
  inputProps,
  inputStyle,
  hints,
  hintStyle,
}) => {
  return (
    <label>
      {titleText && (
        <span className={cn("font-bold", titleStyles)}>{titleText}</span>
      )}
      <input
        className={cn(
          "ring-1 p-2 w-full my-1.5 rounded-sm text-black dark:text-white",
          inputStyle
        )}
        {...inputProps}
      />
      {hints?.map((value, index) =>
        <span key={index} className={cn("block leading-4.5 text-gray-500 dark:text-gray-400", hintStyle)}>
          {value}
        </span>
      )}
    </label>
  );
};

export default Input;
