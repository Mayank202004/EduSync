import { useEffect, useState, useRef } from "react";

export const useChatsPanel = () => {
  const [showChatButton, setShowChatButton] = useState(true);
  const lastScrollY = useRef(0);

  // Scroll direction detection for hiding/showing chat button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setShowChatButton(false); // Scrolling down
      } else {
        setShowChatButton(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { showChatButton };
};
