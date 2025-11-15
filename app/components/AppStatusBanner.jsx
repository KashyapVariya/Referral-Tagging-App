import { useState } from "react";
import { Banner, BlockStack, Text } from "@shopify/polaris";

export default function AppStatusBanner({ appSetting, onToggle }) {
  const [isEnabled, setIsEnabled] = useState(appSetting?.isEnabled ?? true);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (onToggle) onToggle(newValue);
  };

  return (
    <BlockStack alignment="center" distribution="equalSpacing">
      <Banner
        title={isEnabled ? "App is enabled" : "App is disabled"}
        status={isEnabled ? "success" : "critical"}
        tone={isEnabled ? "success" : "warning"}
        action={{
          content: isEnabled ? "Disable App" : "Enable App",
          onAction: handleToggle,
          primary: true,
        }}
      >
        <Text>
          {isEnabled
            ? "This app automatically adds tags to customers when an order is created."
            : "The app is disabled. No tags will be applied to new orders."
          }
        </Text>
      </Banner>
    </BlockStack>
  );
}
