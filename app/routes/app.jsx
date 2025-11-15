import { Link, Outlet, useLoaderData, useRouteError, useNavigation } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import { Frame } from "@shopify/polaris";
import AppLoading from "../components/LoadingProgress";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading" || navigation.state === "submitting";

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      {isLoading && (
        <>
          <AppLoading />
        </>
      )}
      <Frame>
        <NavMenu>
          <Link to="/app" rel="home">Home</Link>
        </NavMenu>
        <Outlet />
      </Frame>
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
