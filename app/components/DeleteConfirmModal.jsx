import { Modal } from "@shopify/polaris";

export default function DeleteConfirmModal({ open, onClose, onConfirm, title, description }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || "Confirm Delete"}
      primaryAction={{
        content: "Delete",
        destructive: true,
        onAction: onConfirm,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <p>{description || "Are you sure you want to delete this item?"}</p>
      </Modal.Section>
    </Modal>
  );
}
