import { useState, useEffect, useRef } from "react";

const useExpandable = (initialState = false) => {
  const [expanded, setExpanded] = useState(initialState);
  const [height, setHeight] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      if (expanded) {
        setHeight(containerRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [expanded]);

  return {
    expanded,
    setExpanded,
    setHeight,
    height,
    containerRef,
  };
};

export default useExpandable;
