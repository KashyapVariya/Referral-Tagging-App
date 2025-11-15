import { useState, useEffect } from "react";
import { Frame, Page } from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import * as referrerService from "../services/referrers";
import { getAppSetting, updateAppSetting } from "../services/appSetting.server.js";
import ReferrersTable from "../components/ReferrersTable";
import ReferrerModal from "../components/ReferrerModal";
import ReferrerToast from "../components/ReferrerToast";
import AppStatusBanner from "../components/AppStatusBanner";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const mappings = await referrerService.getReferrerMappings(shop);
  const appSetting = await getAppSetting(shop);

  return json({ mappings, shop, appSetting });
};

export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    const id = formData.get("id");
    const referrers = formData.get("referrers")?.trim();
    const tag = formData.get("tag")?.trim();
    const isActiveApp = formData.get("isActive") === "true";

    let message = "";
    let mappings = null;
    let updatedSetting = null;

    switch (actionType) {
      case "toggleApp": {
        try {
          const enabled = formData.get("isEnabled") === "true";
          updatedSetting = await updateAppSetting(shop, { isEnabled: enabled });
          message = enabled
            ? "The app has been enabled"
            : "The app has been disabled";
        } catch (err) {
          console.error("App toggle error:", err);
          return json({
            success: false,
            message: "Failed to update app status. Please try again.",
          });
        }
        break;
      }

      case "add": {
        if (!referrers || !tag) {
          return json({ success: false, message: "Both Referrers and Tag are required." });
        }

        const tagExists = await referrerService.isTagExist(shop, tag);
        if (tagExists) {
          return json({ success: false, message: `Tag "${tag}" already exists.` });
        }

        await referrerService.addReferrerMapping(shop, referrers, tag, isActiveApp);
        message = "Added successfully.";
        break;
      }

      case "update": {
        if (!referrers || !tag) {
          return json({ success: false, message: "Both Referrers and Tag are required." });
        }

        const updated = await referrerService.updateReferrerMapping(
          shop,
          Number(id),
          referrers,
          tag,
          isActiveApp
        );
        if (!updated) {
          return json({ success: false, message: "Failed to update." });
        }
        message = "Updated successfully.";
        break;
      }

      case "delete": {
        const ids = formData.get("ids") ? JSON.parse(formData.get("ids")) : [];

        if (!Array.isArray(ids) || !ids.length) {
          return json({ success: false, message: "No referrer IDs provided." });
        }

        const deleted = await referrerService.deleteReferrerMappings(shop, ids);
        if (!deleted || deleted.count === 0) {
          return json({ success: false, message: "Failed to delete." });
        }

        message = ids.length > 1
          ? `${deleted.count} referrers deleted successfully.`
          : "Referrer deleted successfully.";

        break;
      }

      default:
        return json({ success: false, message: "Invalid action type." });
    }

    if (actionType !== "toggleApp") {
      mappings = await referrerService.getReferrerMappings(shop);
    }

    return json({
      success: true,
      mappings,
      appSetting: updatedSetting,
      message,
    });
  } catch (error) {
    console.error("Referrer action error:", error);
    return json({
      success: false,
      message: error.message || "Something went wrong while processing the action.",
    });
  }
};

export default function ReferrersPage() {
  const { mappings: initialMappings, appSetting } = useLoaderData();
  const fetcher = useFetcher();

  const [modalActive, setModalActive] = useState(false);
  const [editMapping, setEditMapping] = useState(null);
  const [referrers, setReferrers] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState('true');
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalError, setModalError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setIsClient(true), []);
  useEffect(() => {
    if (!fetcher.data) return;
    const { success, message } = fetcher.data;
    if (success) {
      setToastMessage(message);
      setToastActive(true);
      setModalError("");
      setModalActive(false);
    } else if (!success && modalActive) {
      setModalError(message);
    }
  }, [fetcher.data]);

  const openModal = (mapping = null) => {
    setEditMapping(mapping);
    setReferrers(mapping?.referrers || "");
    setTag(mapping?.tag || "");
    setStatus(mapping ? (mapping.isActive ? "true" : "false") : "true");
    setModalError("");
    setSubmitted(false);
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
    setEditMapping(null);
    setReferrers("");
    setTag("");
    setStatus("true");
    setModalError("");
    setSubmitted(false);
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!referrers.trim() || !tag.trim()) return;

    const form = new FormData();
    form.append("actionType", editMapping ? "update" : "add");
    if (editMapping) form.append("id", editMapping.id);
    form.append("referrers", referrers);
    form.append("isActive", status);
    form.append("tag", tag);
    fetcher.submit(form, { method: "post" });
  };

  const handleDelete = async (ids) => {
    if (!ids || !ids.length) return;

    const form = new FormData();
    form.append("actionType", "delete");
    form.append("ids", JSON.stringify(ids));
    fetcher.submit(form, { method: "post" });
  };

  const mappings = Array.isArray(fetcher.data?.mappings)
    ? fetcher.data.mappings
    : Array.isArray(initialMappings)
      ? initialMappings
      : [];

  const handleToggleApp = (newValue) => {
    const form = new FormData();
    form.append("actionType", "toggleApp");
    form.append("isEnabled", String(newValue));
    fetcher.submit(form, { method: "post" });
  };

  return (
    <Frame>
      <Page>
        <AppStatusBanner appSetting={appSetting} onToggle={handleToggleApp} />
        <br />

        {isClient && (
          <ReferrersTable
            mappings={mappings}
            onEdit={openModal}
            onDelete={handleDelete}
            onCreate={openModal}
          />
        )}

        <ReferrerModal
          open={modalActive}
          editMapping={editMapping}
          referrers={referrers}
          tag={tag}
          status={status}
          errorMessage={modalError}
          onChangeReferrers={setReferrers}
          onChangeTag={setTag}
          onChangeStatus={setStatus}
          onClose={closeModal}
          onSave={handleSave}
          submitted={submitted}
        />

        {toastActive && (
          <ReferrerToast
            onDismiss={() => setToastActive(false)}
            message={toastMessage}
          />
        )}
        <br />
      </Page>
    </Frame>
  );
}
