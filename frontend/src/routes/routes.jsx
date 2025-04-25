import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import Loader from "../components/Loader/Loader";
import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "../components/PublicRoute/PublicRoute";

const Home = React.lazy(() => import("../pages/Home/Home"));
const Auth = React.lazy(() => import("../pages/Auth/Auth"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Suspense fallback={<Loader size={86} />}>
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/auth",
    element: (
      <Layout>
        <Suspense fallback={<Loader size={86} />}>
          <PublicRoute>
            <Auth />
          </PublicRoute>
        </Suspense>
      </Layout>
    ),
  },
]);

export default router;
