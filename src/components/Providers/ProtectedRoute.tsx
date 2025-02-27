import { ReactNode } from "react";
import { useToken } from "@/hooks/useToken";
import { logOutUser, TUser } from "@/redux/features/Auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Navigate } from "react-router-dom";
import { verifyToken } from "@/utils/verifyToken";

type TProtectedRoute = {
  children: ReactNode;
  role?: string | string[];
};

const ProtectedRoute = ({ children, role }: TProtectedRoute) => {
  const token = useToken() as string;
  const dispatch = useAppDispatch();

  if (!token) {
    dispatch(logOutUser());
    return <Navigate to="/login" replace />;
  }

  const user: TUser | null = token ? verifyToken(token) : null;
  console.log(user);

  if (!user || !user.role) {
    dispatch(logOutUser());
    return <Navigate to="/login" replace />;
  }

  // Convert `role` to an array (if it's a string)
  const allowedRoles = Array.isArray(role) ? role : [role];

  // Check if user role exists in allowed roles
  if (role?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
