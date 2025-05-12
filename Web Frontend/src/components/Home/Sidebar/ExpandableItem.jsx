import React, { useState, useRef, useEffect } from 'react';

const ExpandableItem = ({ title, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (expanded) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded, children]);

  return (
    <div className="mb-3">
      <div
        className="cursor-pointer font-semibold mb-1 flex justify-between items-center"
        onClick={() => setExpanded(prev => !prev)}
      >
        <span>{title}</span>
        <span>{expanded ? '−' : '+'}</span>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: `${height}px`,
          transition: 'max-height 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <div className="pl-4">{children}</div>
      </div>
    </div>
  );
};

export default ExpandableItem;
