const playSound = (url) => {
  const audio = new Audio(url);
  audio.play().catch((err) => {
    // console.warn("Autoplay prevented:", err);
  });
};

export default playSound;