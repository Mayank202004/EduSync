import { useEffect, useRef } from "react";

const useClickOutside = (onClickOutside) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClickOutside();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // for mobile

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [containerRef, onClickOutside]);

  return containerRef;
};

export default useClickOutside;
