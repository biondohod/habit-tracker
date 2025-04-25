import { Navigate } from "react-router-dom";
import { useUser } from "../../query/queries";
import Loader from "../Loader/Loader";

const PublicRoute = ({ children }) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <Loader size={86} />;

  if (user) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;
