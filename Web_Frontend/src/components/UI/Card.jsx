import React from 'react';
import clsx from 'clsx';

export const Card = ({ children, className }) => (
  <div className={clsx("bg-white dark:bg-gray-900 shadow-md rounded-xl", className)}>
    {children}
  </div>
);

export const CardContent = ({ children, className }) => (
  <div className={clsx("p-4", className)}>
    {children}
  </div>
);
