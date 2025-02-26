import { useCurrentToken } from "@/redux/features/Auth/authSlice";
import { useAppSelector } from "@/redux/hooks";

export const useToken = () => {
    const token = useAppSelector(useCurrentToken);
    return token;
}