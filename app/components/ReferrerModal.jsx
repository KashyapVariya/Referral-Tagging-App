import { Modal, FormLayout, TextField, Banner, Select } from "@shopify/polaris";

export default function ReferrerModal({
  open,
  editMapping,
  referrers,
  tag,
  status,
  errorMessage,
  onChangeReferrers,
  onChangeTag,
  onChangeStatus,
  onClose,
  onSave,
  submitted,
}) {
  const options = [
    { label: 'Active', value: 'true' },
    { label: 'Draft', value: 'false' },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editMapping ? "Edit Referrer" : "Add Referrer"}
      primaryAction={{ content: "Save", onAction: onSave }}
    >
      <Modal.Section>
        <FormLayout>
          {errorMessage && (
            <Banner title={errorMessage} tone="warning" />
          )}

          <Select
            label="Status"
            options={options}
            onChange={(value) => onChangeStatus(value)}
            value={status}
          />

          <TextField
            label="Referrers"
            value={referrers}
            onChange={onChangeReferrers}
            error={submitted && !referrers.trim() ? "Referrers cannot be empty" : undefined}
            helpText="Use a comma ( , ) as the separator for multiple referrers."
          />

          <TextField
            label="Tag"
            value={tag}
            onChange={onChangeTag}
            error={submitted && !tag.trim() ? "Tag cannot be empty" : undefined}
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}
