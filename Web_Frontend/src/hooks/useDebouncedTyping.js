import { useRef, useEffect } from "react";

/**
 * @desc Handles debounced typing
 * @param {socket} socket 
 * @param {String} chatId 
 * @param {Object<_id,fullName,avatar>} user 
 * @returns {Function} onType
 */
const useDebouncedTyping = (socket, chatId, user) => {
  const typingTimeout = useRef(null);

  const onType = () => {
    socket.emit("typing", { chatId, user });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId, userId: user._id });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout.current);
    };
  }, []);

  return onType;
};

export default useDebouncedTyping;