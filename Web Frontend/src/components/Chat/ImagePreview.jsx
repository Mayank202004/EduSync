import useClickOutside from "@/hooks/useClickOutside";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconTextButton from "./IconTextButton";

import ModalWrapper from "./ModalWrapper";

const ImagePreview = ({ onClose, url, header = null }) => {
  const [containerRef] = useClickOutside(onClose);
  return (
    <ModalWrapper>
      <div
        ref={containerRef}
        className="bg-customLightBg dark:bg-customDarkFg p-4 rounded-lg "
      >
        <div className="flex flex-nowrap gap-2 w-full items-center">
          {header}
          <IconTextButton
            className="rounded-full overflow-hidden size-8 flex items-center justify-center ml-auto"
            buttonProps={{ onClick: onClose }}
            icon={
              <FontAwesomeIcon
                icon={faClose}
                className="fa-lg text-gray-500"
              ></FontAwesomeIcon>
            }
          />
        </div>
        <hr className="my-2" />
        <img
          className="max-h-[70vh] object-cover mx-auto"
          src={url}
          alt="image"
        />
      </div>
    </ModalWrapper>
  );
};

export default ImagePreview;
