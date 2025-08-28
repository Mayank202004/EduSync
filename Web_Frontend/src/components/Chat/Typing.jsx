import React from 'react'
const Typing = () => {
  return (
    <div className="p-1 w-fit inline-flex gap-1.5">
      <span className="h-2 w-2 bg-zinc-600 dark:bg-zinc-300 rounded-full animate-bounce1"></span>
      <span className="h-2 w-2 bg-zinc-600 dark:bg-zinc-300 rounded-full animate-bounce2"></span>
      <span className="h-2 w-2 bg-zinc-600 dark:bg-zinc-300 rounded-full animate-bounce3"></span>
    </div>
  );
};

export default Typing;

