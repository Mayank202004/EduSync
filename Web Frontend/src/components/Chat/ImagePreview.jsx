import useClickOutside from "@/hooks/useClickOutside";

import ModalWrapper from "./ModalWrapper";

const ImagePreview = ({ onClose, url }) => {
  const [containerRef] = useClickOutside(onClose);
  return (
    <ModalWrapper>
      <div ref={containerRef} className="bg-customLightBg dark:bg-customDarkFg p-3">
        <img className="max-h-[70vh] object-cover" src={url} alt="image" />
      </div>
    </ModalWrapper>
  );
};

export default ImagePreview;
