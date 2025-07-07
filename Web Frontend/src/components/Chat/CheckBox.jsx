import { cn } from "@/lib/cn";

const Checkbox = ({ label, labelStyle, containerStyle, inputStyle, inputProps = {} }) => {
  return (
    <label className={cn("flex gap-4 cursor-pointer", containerStyle)}>
      <input type="checkbox" className={cn(inputStyle)} {...inputProps} />
      <span className={cn(labelStyle)}>{label}</span>
    </label>
  );
};

export default Checkbox;
