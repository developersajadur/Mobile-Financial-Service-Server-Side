/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  useGetAllUserQuery,
  useUpdateUserStatusMutation,
} from "@/redux/features/User/userApi";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Loader from "../Loaders/Loader";
import { Link } from "react-router-dom";

const ManageUsersTable = () => {
  const [query, setQuery] = useState<Record<string, string>>({});
  const { control, watch, setValue } = useForm({
    defaultValues: { search: "" },
  });

  const search = watch("search");

  // Fetch users
  const { data, isLoading } = useGetAllUserQuery(query);
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();
  const users = data?.data?.result || [];

  // Handle user status change (Block/Unblock)
  const handleStatusChange = async (userId: string, isBlocked: boolean) => {
    try {
      const res = await updateUserStatus({ userId, isBlocked }).unwrap();
      if (res.success) {
        toast.success(`User ${isBlocked ? "Blocked" : "Unblocked"} Successfully`);
      }
    } catch (error: any) {
      toast.error(error.message || "Error updating user status");
    }
  };

  // Debounced search handling
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setQuery(search.trim() ? { search } : {});
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">User Management</h1>

        {/* Search Input */}
        <form onSubmit={(e) => e.preventDefault()} className="w-full md:w-auto">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <Input
                className="w-96"
                type="text"
                placeholder="Search by Number..."
                {...field}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  value = value.replace(/^0+/, ""); // Remove leading zeros
                  setValue("search", value);
                  setQuery(value ? { search: value } : {});
                }}
              />
            )}
          />
        </form>
      </div>

      {isLoading ? (
        <Loader />
      ) : users.length === 0 ? (
        <div className="text-center py-6 text-gray-600">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>NID Number</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user._id}>
                  <Link to={`/dashboard/transactions/users/${user._id}`}>
                  <TableCell className="hover:underline">{user.fullName}</TableCell>
                  </Link>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.nidNumber || "N/A"}</TableCell>
                  <TableCell>{user.balance} BDT</TableCell>
                  <TableCell>{user.income} BDT</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.isBlocked ? "block" : "unblock"}
                      onValueChange={(value) =>
                        handleStatusChange(user._id, value === "block")
                      }
                      disabled={isUpdating} // Disable while updating
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {user.isBlocked ? "Blocked" : "Unblocked"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unblock">Unblock</SelectItem>
                        <SelectItem value="block">Block</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ManageUsersTable;
