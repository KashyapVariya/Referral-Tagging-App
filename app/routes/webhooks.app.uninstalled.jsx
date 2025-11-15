import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  if (session) {
    const result = await prisma.session.deleteMany({ where: { shop } });
    console.log(`Deleted ${result.count} session(s) for shop: ${shop}`);
  } else {
    console.warn(`No active session found for shop: ${shop}`);
  }

  return new Response();
};
