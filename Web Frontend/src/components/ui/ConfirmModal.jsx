import ModalWrapper from "./ModalWrapper";
import SimpleButton from "./SimpleButton";
import OutlinedButton from "./OutlinedButton";
import { cn } from "@/lib/cn";

const ConfirmModal = ({
  modalStyle,
  containerStyle,
  onConfirm,
  onCancel,
  children
}) => {
  return (
    <ModalWrapper className={modalStyle}>
      <div className={cn("bg-white dark:bg-customDarkFg rounded-xl p-6 max-w-md shadow-lg flex flex-col gap-4", containerStyle)}>
        {children}
        <div className="flex w-fit ml-auto gap-3">
          <OutlinedButton buttonProps={{ onClick: onCancel }}>
            Cancel
          </OutlinedButton>
          <SimpleButton predefinedColor="danger" buttonProps={{ onClick: onConfirm }}>
            Confirm
          </SimpleButton>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmModal;
