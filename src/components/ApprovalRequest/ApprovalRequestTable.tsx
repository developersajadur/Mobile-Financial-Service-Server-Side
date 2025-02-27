/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import Loader from "../Loaders/Loader";
  import { useGetApprovalRequestQuery, useApproveUserMutation } from "@/redux/features/User/userApi";
  import { toast } from "sonner";
  
  const ApprovalRequestTable = () => {
    const { data, isLoading } = useGetApprovalRequestQuery(undefined);
    const [approveUser] = useApproveUserMutation();
    
    const approvalRequests = data?.data || [];
  
    const handleApprove = async (userId: string) => {
      try {
       const res = await approveUser(userId).unwrap();
       if(res.success) {
        toast.success("User approved successfully!");
       }
      } catch (error: any) {
        toast.error(error.message || "Failed to approve user.");
      }
    };
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Approval Requests</h1>
        {isLoading ? (
          <Loader />
        ) : approvalRequests.length === 0 ? (
          <div className="text-center py-6 text-gray-600">No approval requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>NID Number</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Action</TableHead> {/* Added Action column */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalRequests.map((request: any) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.fullName}</TableCell>
                    <TableCell>{request.phoneNumber}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.nidNumber || "N/A"}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleApprove(request._id)} className="bg-blue-500">
                        Approve
                      </Button>
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
  
  export default ApprovalRequestTable;
  