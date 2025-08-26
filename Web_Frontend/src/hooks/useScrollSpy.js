import { useEffect, useRef, useState } from "react";

const useScrollspy = (elements, options = { root: null, offset: 0 }) => {
  const [currentIntersectingElementIndex, setCurrentIntersectingElementIndex] =
    useState(-1);

  const rootMargin = `-${(options?.offset || 0)}px 0px -40% 0px`;
  const observer = useRef();

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        // Filter only visible sections
        const visible = entries
          .map((entry, i) => ({
            index: elements.indexOf(entry.target),
            isIntersecting: entry.isIntersecting,
            ratio: entry.intersectionRatio,
            y: entry.boundingClientRect.y,
          }))
          .filter((e) => e.isIntersecting);

        if (visible.length > 0) {
          // ✅ pick the last visible section (lowest in viewport)
          const lastVisible = visible.reduce((a, b) =>
            a.y > b.y ? a : b
          );
          setCurrentIntersectingElementIndex(lastVisible.index);
        } else {
          // ✅ fallback: if scrolled to very bottom, force last section
          if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 2
          ) {
            setCurrentIntersectingElementIndex(elements.length - 1);
          }
        }
      },
      {
        root: options?.root instanceof Element ? options.root : null,
        rootMargin,
      }
    );

    const { current: ourObserver } = observer;
    elements?.forEach((element) => element && ourObserver.observe(element));

    return () => ourObserver.disconnect();
  }, [elements, options, rootMargin]);

  return [currentIntersectingElementIndex];
};

export default useScrollspy;
