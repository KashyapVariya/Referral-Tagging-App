import { ADD_CUSTOMER_TAGS } from "../graphql/mutations/customerMutations.js";
import { getReferrerMappings } from "./referrers.js";

/**
 * Add tags to a Shopify customer based on order referrer
 * @param {object} admin - Shopify admin client
 * @param {string} customerId
 * @param {string} shop - Shop domain
 * @param {string[]} orderTags - Tags from the order
 */
export async function addCustomerTags(admin, customerId, shop, orderTags = []) {
  try {
    console.log("[Webhook]: Start processing customer tags.");

    if (!orderTags.length) {
      console.log("[Webhook]: No tags to process. Exiting.");
      return false;
    }

    const finalTags = await mapTagsFromReferrers(shop, orderTags);
    console.log("[Server]: Final tags to add to customer:", finalTags);

    if (!finalTags.length) return false;

    const response = await admin.graphql(ADD_CUSTOMER_TAGS, {
      variables: { id: customerId, tags: finalTags },
    });

    console.log("[Server]: GraphQL response:", response.status);

    const errors = response.body?.data?.tagsAdd?.userErrors || [];
    if (errors.length) {
      console.error("[Server]: Error adding tags:", errors);
      return false;
    }

    console.log("[Server]: Tag added to customer.");
    return true;
  } catch (err) {
    console.error("[Server]: GraphQL / addCustomerTags error:", err);
    return false;
  }
};

/**
 * Find the DB tag for a given referrer URL
 * Splits the referrers in DB by comma or space and matches
 * @param {string} shop
 * @param {string} referrer
 * @returns {string|null} tag
 */
export async function findTagByReferrer(shop, referrer) {
  console.log(`[Server]: Looking for tag for referrer: "${referrer}" in shop: "${shop}"`);

  const mappings = await getReferrerMappings(shop, true);
  console.log(`[Server]: Total active mappings found: ${mappings.length}`);

  for (const mapping of mappings) {
    const refArray = mapping.referrers
      .split(/[, ]+/)
      .map((r) => r.trim())
      .filter(Boolean);

    if (refArray.includes(referrer.trim())) {
      console.log(`[Server]: Match found! Returning tag: "${mapping.tag}"`);
      return mapping.tag;
    }
  }

  console.log("[Server]: No match found.");
  return null;
}

/**
 * Map an array of incoming tags/referrers to DB tags
 * @param {string} shop
 * @param {string[]} incomingTags
 * @returns {Promise<string[]>} finalTags
 */
export async function mapTagsFromReferrers(shop, incomingTags = []) {
  console.log("[Server]: Mapping incoming tags/referrers:", incomingTags);

  const finalTags = [];

  for (const tag of incomingTags) {
    const dbTag = await findTagByReferrer(shop, tag);
    finalTags.push(dbTag || tag);
  }

  console.log("[Server]: Final mapped tags:", finalTags);
  return finalTags;
}
