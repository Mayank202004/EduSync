import ModalWrapper from "./ModalWrapper";
import SimpleButton from "./SimpleButton";
import OutlinedButton from "./OutlinedButton";
import TitledContainer from "./TitledContainer";

const ConfirmModal = ({
  modalStyle,
  containerStyle,
  title = "Confirm",
  onConfirm,
  onCancel,
  children
}) => {
  return (
    <ModalWrapper className={modalStyle}>
      <TitledContainer title={title} titleStyle="text-xl mb-1" containerStyle={["rounded-xl p-6 max-w-md w-fit shadow-lg flex flex-col", containerStyle]}>
        {children}
        <div className="flex w-fit ml-auto gap-3 mt-4">
          <OutlinedButton buttonProps={{ onClick: onCancel }}>
            Cancel
          </OutlinedButton>
          <SimpleButton predefinedColor="danger" buttonProps={{ onClick: onConfirm }}>
            Confirm
          </SimpleButton>
        </div>
      </TitledContainer>
    </ModalWrapper>
  );
};

export default ConfirmModal;
