import toggleLight from "@/assets/day.png";
import toggleDark from "@/assets/night.png";

import IconTextButton from "../ui/IconTextButton";

const ToggleTheme = ({ theme, setTheme }) => {
  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <IconTextButton
      buttonProps={{ onClick: handleToggleTheme, ariaLabel: "Toggle Theme" }}
      icon={
        <img
          src={theme === "light" ? toggleDark : toggleLight}
          alt="Theme Toggle"
          className="size-6.5 cursor-pointer select-none"
          draggable="false"
        />
      }
      className="flex rounded-full p-1"
    />
  );
};

export default ToggleTheme;