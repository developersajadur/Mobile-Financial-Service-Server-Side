/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLogOutMutation } from "@/redux/features/Auth/authApi";
import { logOutUser } from "@/redux/features/Auth/authSlice";
import { useCurrentFingerprint } from "@/redux/features/Auth/deviceFingerprintSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

const DuplicateDeviceAlertDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
   const [logOut] = useLogOutMutation();
    const dispatch = useAppDispatch();
    const number = useAppSelector(useCurrentFingerprint);

  const handleLogoutDoubleDevice = async() => {
    try {
      await logOut(number).unwrap();
        dispatch(logOutUser());
        toast.success("Logged out from other device successfully!");
        onClose();

    } catch (error:any) {
      toast.error(error.message || "Logout failed. Please try again.");
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You are already logged in on another device!</AlertDialogTitle>
          <AlertDialogDescription>
            Please log out from the other device and log in again to continue using the app.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogoutDoubleDevice}>Log Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DuplicateDeviceAlertDialog;
