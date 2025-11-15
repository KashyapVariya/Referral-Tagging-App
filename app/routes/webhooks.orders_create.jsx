import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { addCustomerTags } from "../services/customers.js";
import { getAppSetting } from "../services/appSetting.server.js";


export const action = async ({ request }) => {
  console.log("[Webhook]: Order Created.");

  const { admin, shop, payload } = await authenticate.webhook(request);

  const setting = await getAppSetting(shop);
  if (!setting || !setting.isEnabled) {
    console.log(`[Webhook]: App is disabled for shop ${shop}. Skipping webhook.`);
    return new Response(null, { status: 200 });
  }

  const customerId = payload.customer?.admin_graphql_api_id;
  if (!customerId) return new Response(null, { status: 200 });

  const referrer = getNoteAttribute(payload, "referrer");
  if (referrer) {
    await addCustomerTags(admin, customerId, shop, [referrer]);
  }

  return json({ success: true });
};

function getNoteAttribute(order, name) {
  if (!order.note_attributes) return null;
  const attr = order.note_attributes.find((na) => na.name === name);
  return attr ? decodeURIComponent(attr.value) : null;
}
