import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import Loader from "../components/Loader/Loader";
import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "../components/PublicRoute/PublicRoute";

const Home = React.lazy(() => import("../pages/Home/Home"));
const Auth = React.lazy(() => import("../pages/Auth/Auth"));
const CreateHabit = React.lazy(() =>
  import("../pages/CreateHabit/CreateHabit")
);
const EditHabit = React.lazy(() => import("../pages/EditHabit/EditHabit"));
const ProfilePage = React.lazy(() =>
  import("../components/ProfilePage/ProfilePage")
);

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
    path: "/create",
    element: (
      <Layout>
        <Suspense fallback={<Loader size={86} />}>
          <ProtectedRoute>
            <CreateHabit />
          </ProtectedRoute>
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/edit/:id",
    element: (
      <Layout>
        <Suspense fallback={<Loader size={86} />}>
          <ProtectedRoute>
            <EditHabit />
          </ProtectedRoute>
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <Suspense fallback={<Loader size={86} />}>
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/auth",
    element: (
      <Layout showHeader={false}>
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
