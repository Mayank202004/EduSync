import { useEffect, useRef } from "react";

/**
 * Detects clicks outside of a main container, optionally ignoring a second container.
 * 
 * @param {Function} onClickOutside - Callback to run when clicking outside.
 * @returns {[React.RefObject, React.RefObject]} - [containerRef, ignoreContainerRef]
 */
const useClickOutside = (onClickOutside) => {
  const containerRef = useRef(null);
  const ignoreContainerRef = useRef(null); // Optional, exposed to the user

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;

      const isOutsideMain =
        containerRef.current && !containerRef.current.contains(target);

      const isInsideIgnore =
        ignoreContainerRef.current &&
        ignoreContainerRef.current.contains(target);

        if (isOutsideMain && !isInsideIgnore) {
        onClickOutside();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClickOutside]);

  return [containerRef, ignoreContainerRef];
};

export default useClickOutside;
