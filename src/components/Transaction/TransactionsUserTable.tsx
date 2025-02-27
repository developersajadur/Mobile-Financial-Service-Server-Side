/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
  } from "@/components/ui/table";
  import { useGetMyTransactionsQuery } from "@/redux/features/Transaction/transactionApi";
  import Loader from "../Loaders/Loader";
  
  const TransactionsUserTable = () => {
    const { data, isLoading } = useGetMyTransactionsQuery(undefined);
    const transactions = data?.data;
  
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">User Transactions</h1>
  
        {/* Show Loader when data is fetching */}
        {isLoading ? (
          <Loader />
        ) : transactions?.length === 0 ? (
          // Show message if no transactions are found
          <div className="text-center py-6 text-gray-600">
            No transactions found.
          </div>
        ) : (
          // Show the table if data exists
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent/User Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Transaction Id</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction: any) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {transaction.type === "withdraw"
                      ? transaction?.agentNumber || "No User"
                      : transaction.type === "deposit"
                      ? transaction.user?.phoneNumber || "No User"
                      : transaction.type === "transfer"
                      ? transaction.recipient?.phoneNumber || "No User"
                      : transaction.recipientNumber || "No User"}
                  </TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>{transaction.transactionId}</TableCell>
                  <TableCell>{transaction.amount} BDT</TableCell>
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };
  
  export default TransactionsUserTable;
  