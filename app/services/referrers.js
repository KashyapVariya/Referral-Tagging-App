import prisma from "../db.server";

/**
 * Get all referrer mappings for a shop
 * @param {string} shop
 * @param {boolean} onlyActive
 */
export async function getReferrerMappings(shop, onlyActive = false) {
  return prisma.referrerMapping.findMany({
    where: { shop, ...(onlyActive ? { isActive: true } : {}) },
    orderBy: { id: "desc" },
  });
}

/**
 * Add a single referrer mapping.
 */
export async function addReferrerMapping(shop, referrers, tag, isActive = true) {
  return await prisma.referrerMapping.create({
    data: { shop, referrers, tag, isActive },
  });
}

/**
 * Update a referrer mapping by ID
 */
export async function updateReferrerMapping(shop, id, referrers, tag, isActive) {
  return await prisma.referrerMapping.update({
    where: { shop, id },
    data: { referrers, tag, isActive },
  });
}

/**
 * Delete a referrer mapping by ID
 */
export async function deleteReferrerMapping(shop, id) {
  return await prisma.referrerMapping.delete({
    where: { shop, id },
  });
}

/**
 * Delete multiple referrer mappings by IDs
 * @param {string} shop
 * @param {Array<number>} ids
 */
export async function deleteReferrerMappings(shop, ids) {
  if (!ids || !ids.length) return { count: 0 };

  return await prisma.referrerMapping.deleteMany({
    where: {
      shop,
      id: { in: ids },
    },
  });
}

/** 
 * Check if a tag exists for a shop
 */
export async function isTagExist(shop, tag) {
  const existing = await prisma.referrerMapping.findFirst({
    where: { shop, tag },
  });

  return !!existing;
}
