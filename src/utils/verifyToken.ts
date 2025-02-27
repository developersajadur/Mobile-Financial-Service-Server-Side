
import {jwtDecode} from 'jwt-decode'


import { TUser } from "@/redux/features/Auth/authSlice";

export const verifyToken = (token: string) => {
  try {
    return jwtDecode<TUser>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
