import { Toast } from "@shopify/polaris";

export default function ReferrerToast({ onDismiss, message }) {
  return <Toast content={message} onDismiss={onDismiss} />;
}
