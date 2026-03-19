import { Navigate } from "react-router-dom";
import useUser from "@/store/useUser";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
}

const RoleRedirect = () => {
  const { user } = useUser();
  const token = localStorage.getItem("authToken");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const payload = jwtDecode<JwtPayload>(token);

  switch (payload.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "ustadz":
      return <Navigate to="/ustadz" replace />;
    case "santri":
      return <Navigate to="/santri" replace />;
    case "ortu":
      return <Navigate to="/ortu" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default RoleRedirect;
