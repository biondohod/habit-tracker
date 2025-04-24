import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import Loader from "../components/Loader/Loader";
import Layout from "../components/Layout/Layout";

const Home = React.lazy(() => import("../pages/Home/Home"));
const Auth = React.lazy(() => import("../pages/Auth/Auth"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Suspense fallback={<Loader size={86} />}>
          <Home />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/auth",
    element: (
      <Layout>
        <Suspense fallback={<Loader size={86} />}>
          <Auth />
        </Suspense>
      </Layout>
    ),
  },
]);

export default router;
