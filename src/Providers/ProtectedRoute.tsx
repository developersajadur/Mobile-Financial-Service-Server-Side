import { ReactNode, useEffect, useState } from "react";
import { useToken } from "@/hooks/useToken";
import { logOutUser, TUser } from "@/redux/features/Auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Navigate } from "react-router-dom";
import { verifyToken } from "@/utils/verifyToken";
import { useUser } from "@/hooks/useUser";
import Loader from "@/components/Loaders/Loader";
import { 
  useGetDeviceFingerprintForMatchingQuery, 
  useGetUserFingerprintQuery, 
  useLogOutMutation
} from "@/redux/features/Auth/authApi"; 
import { toast } from "sonner";

type TProtectedRoute = {
  children: ReactNode;
  role?: string | string[];
};

const ProtectedRoute = ({ children, role }: TProtectedRoute) => {
  const token = useToken() as string | null;
  const [logOut] = useLogOutMutation();
  const currentUser = useUser();
  const dispatch = useAppDispatch();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const { data: fingerprintData, isLoading: isFingerprintLoading } = useGetUserFingerprintQuery(undefined, {
    skip: !token, 
  });

  // Fetch client-generated fingerprint for comparison
  const { data: deviceFingerprintData, isLoading: isDeviceFingerprintLoading } = useGetDeviceFingerprintForMatchingQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!token || !currentUser) {
        dispatch(logOutUser());
        setIsAuthorized(false);
        return;
      }

      const user: TUser | null = verifyToken(token);

      if (!user || !user.role) {
        toast.error("Invalid session. Logging out...");
        dispatch(logOutUser()); 
        setIsAuthorized(false);
        return;
      }

      const allowedRoles = Array.isArray(role) ? role : [role];

      if (role && !allowedRoles.includes(user.role)) {
        setIsAuthorized(false);
        return;
      }

      if (fingerprintData && deviceFingerprintData) {
        const storedFingerprint = fingerprintData.data;
        const deviceFingerprint = deviceFingerprintData.data;

        if (!storedFingerprint || storedFingerprint !== deviceFingerprint) {
          toast.error("You are already logged in from another device. Logging out...");
          await logOut(user?.phoneNumber).unwrap();
          dispatch(logOutUser());
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      }
    };

    checkAuthorization();
  }, [token, currentUser, role, fingerprintData, deviceFingerprintData, dispatch, logOut]);


  if (isFingerprintLoading || isDeviceFingerprintLoading || isAuthorized === null) {
    return <Loader />;
  }

  // Redirect if unauthorized
  if (isAuthorized === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
