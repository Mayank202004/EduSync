import useScrollspy from "@/hooks/useScrollSpy";

import scrollToElemendId from "@/lib/scrollToElementId";
import { cn } from "@/lib/cn";

const ScrollSpy = ({ elements, titleElementMap, offset, rootRef }) => {
  const [activeIndex] = useScrollspy(elements, {
    root: rootRef,
    offset: offset,
  });

  return (
    //self-start required to make sticky work, also dont add any overflow property on parent elements
    <div className="tablet:sticky tablet:self-start tablet:left-10 tablet:top-0 tablet:bottom-0 tablet:right-2 flex order-first tablet:mx-0 my-2 flex-col h-fit gap-3 p-4 tablet:p-2 max-w-xs tablet:max-w-56 w-full">
      <h1 className="font-bold text-gray-400 tracking-widest">Jump to</h1>
      <ul className="border-s-1 space-y-2.5 text-sm">
        {titleElementMap.map(({ id, title }, index) => {
          return (
            <li
              key={index}
              className={cn(
                "flex flex-col px-3 opacity-50 border-s-3 border-gray-300 transition-all duration-200",
                index !== activeIndex && "not-hover:border-transparent",
                index === activeIndex &&
                  "text-blue-400 opacity-100 border-blue-400 text-wrap"
              )}
            >
              <a
                key={id}
                href={`#${id}-section`}
                onClick={(event) =>
                  scrollToElemendId(event, `${id}-section`, offset)
                }
              >
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ScrollSpy;
