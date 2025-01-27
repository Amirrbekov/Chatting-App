import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore"


const ProtectedRoute = ({ children }: any) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; // upgrade ?