//taken from: https://blog.maximeheckel.com/posts/scrollspy-demystified/

import { useEffect, useRef, useState } from "react";

const useScrollspy = (
  elements,
  options = {root: null, offset: 0}
)=> {
  const [
    currentIntersectingElementIndex,
    setCurrentIntersectingElementIndex,
  ] = useState(-1);

  const rootMargin = `-${(options && options.offset) || 0}px 0px 0px 0px`;

  const observer = useRef();

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        // find the index of the section that is currently intersecting
        const indexOfElementIntersecting = entries.findIndex((entry) => {
          // if intersection > 0 it means entry is intersecting with the view port
          if (entry.isIntersecting) console.log(entry)
          return entry.intersectionRatio > 0;
        });

        // store the value of indexOfElementIntersecting
        setCurrentIntersectingElementIndex(indexOfElementIntersecting);
      },
      {
        root: options?.root instanceof Element ? options.root : null,
        // use this option to handle custom offset
        rootMargin,
      }
    );
    console.log(options.root)

    const { current: ourObserver } = observer;

    // observe all the elements passed as argument of the hook
    elements?.forEach((element) =>
      element ? ourObserver.observe(element) : null
    );

    return () => ourObserver.disconnect();
  }, [elements, options, rootMargin]);

  return [currentIntersectingElementIndex];
};

export default useScrollspy;