import { Navigate, Outlet } from 'react-router-dom';
import useUser from '@/store/useUser';
import { isTokenExpired } from '@/utils/jwt';

type UserRole = 'admin' | 'ustadz' | 'santri' | 'ortu';

interface PrivateRouteProps {
  allowedRoles: UserRole[];
  redirectPath?: string;
}

const PrivateRoute = ({ 
  allowedRoles, 
  redirectPath = '/login' 
}: PrivateRouteProps) => {
  // const { user, clearUser } = useUser();
  const { user } = useUser();
  const token = localStorage.getItem("authToken");

  if (!token) {
    // clearUser();
    return <Navigate to={redirectPath} replace />;
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    // clearUser();
    return <Navigate to={redirectPath} replace />;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;
