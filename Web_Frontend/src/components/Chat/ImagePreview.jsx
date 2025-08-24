import { faClose } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useClickOutside from "@/hooks/useClickOutside";
import IconTextButton from "./IconTextButton";
import ModalWrapper from "./ModalWrapper";
import triggerCloudinaryDownload from "@/lib/triggerCloudinaryDownload";

const ImagePreview = ({ onClose, url, filename, header = null }) => {
  const [containerRef] = useClickOutside(onClose);

  return (
    <ModalWrapper>
      <div
        ref={containerRef}
        className="bg-white dark:bg-customDarkFg p-4 rounded-lg"
      >
        <div className="flex flex-nowrap gap-2 w-full items-center">
          {header}
          <div className="ml-auto flex gap-2">
            <IconTextButton
              className="rounded-full overflow-hidden size-8 flex items-center justify-center"
              buttonProps={{
                onClick: () => triggerCloudinaryDownload(url, filename),
              }}
              icon={
                <FontAwesomeIcon
                  icon={faDownload}
                  className="fa-lg text-gray-500 dark:text-gray-400"
                ></FontAwesomeIcon>
              }
            />
            <IconTextButton
              className="rounded-full overflow-hidden size-8 flex items-center justify-center"
              buttonProps={{ onClick: onClose }}
              icon={
                <FontAwesomeIcon
                  icon={faClose}
                  className="fa-lg text-gray-500 dark:text-gray-400"
                ></FontAwesomeIcon>
              }
            />
          </div>
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