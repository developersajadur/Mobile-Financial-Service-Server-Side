import App from "@/App";
import ProtectedRoute from "@/Providers/ProtectedRoute";
import ApprovalRequestPage from "@/pages/ApprovalRequest";
import DashboardPage from "@/pages/Dashboard";
import DepositPage from "@/pages/Deposit";
import LoginPage from "@/pages/Login";
import ManageUsersPage from "@/pages/ManageUsers";
import RegisterPage from "@/pages/Register";
import TransactionsPage from "@/pages/Transactions";
import TransferPage from "@/pages/Transfer";
import UserTransactionDetailsPage from "@/pages/UserTransactionDetails";
import WithdrawPage from "@/pages/Withdraw";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element:  <ProtectedRoute role={["agent", "admin", "user"]}><App /></ProtectedRoute>,
    children: [
      {
        index: true, // This makes `/` render `DashboardPage`
        element: <ProtectedRoute role={["agent", "admin", "user"]}><DashboardPage /></ProtectedRoute>,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute role={["agent", "admin", "user"]}><DashboardPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/deposit-money",
        element: <ProtectedRoute role={["agent"]}><DepositPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/withdraw-money",
        element: <ProtectedRoute role={["user"]}><WithdrawPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/transfer-money",
        element: <ProtectedRoute role={["user"]}><TransferPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/transactions",
        element: <ProtectedRoute role={["agent", "admin", "user"]}><TransactionsPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/manage-users",
        element: <ProtectedRoute role={["admin"]}><ManageUsersPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/approval-request",
        element: <ProtectedRoute role={["admin"]}><ApprovalRequestPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/transactions/users/:id",
        element: <ProtectedRoute role={["admin"]}><UserTransactionDetailsPage /></ProtectedRoute>,
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

export default router;
