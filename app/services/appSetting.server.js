import prisma from "../db.server";

/**
 * Get AppSetting for a shop
 * @param {string} shop
 * @returns {Promise<Object|null>}
 */
export async function getAppSetting(shop) {
  return prisma.appSetting.findUnique({
    where: { shop },
  });
}

/**
 * Create AppSetting for a shop
 * @param {string} shop
 * @param {boolean} isEnabled
 * @returns {Promise<Object>}
 */
export async function createAppSetting(shop, isEnabled = true) {
  return prisma.appSetting.create({
    data: { shop, isEnabled },
  });
}

/**
 * Update AppSetting for a shop
 * @param {string} shop
 * @param {Object} updates - Object containing fields to update (e.g., { isEnabled: true })
 * @returns {Promise<Object>}
 */
export async function updateAppSetting(shop, updates) {
  return prisma.appSetting.update({
    where: { shop },
    data: updates,
  });
}

/**
 * Toggle isEnabled for a shop
 * @param {string} shop
 * @returns {Promise<Object>}
 */
export async function toggleAppSetting(shop) {
  const current = await getAppSetting(shop);
  if (!current) throw new Error("AppSetting not found");

  return updateAppSetting(shop, { isEnabled: !current.isEnabled });
}

/**
 * Delete AppSetting for a shop
 * @param {string} shop
 * @returns {Promise<Object>}
 */
export async function deleteAppSetting(shop) {
  return prisma.appSetting.delete({
    where: { shop },
  });
}

/**
 * Create default AppSetting if it doesn't exist
 * @param {string} shop
 * @returns {Promise<Object>}
 */
export async function createDefaultAppSetting(shop) {
  return prisma.appSetting.upsert({
    where: { shop },
    update: {},
    create: { shop, isEnabled: true },
  });
}
