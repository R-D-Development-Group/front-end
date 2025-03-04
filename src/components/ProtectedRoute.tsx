import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
