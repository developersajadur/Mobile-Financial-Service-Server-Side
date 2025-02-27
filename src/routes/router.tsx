import App from "@/App";
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
    element: <App />,
    children: [
      {
        index: true, // Default route for "/"
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "dashboard/deposit-money",
        element: <DepositPage />,
      },
      {
        path: "dashboard/withdraw-money",
        element: <WithdrawPage />,
      },
      {
        path: "dashboard/transfer-money",
        element: <TransferPage />,
      },
      {
        path: "dashboard/transactions",
        element: <TransactionsPage />,
      },
      {
        path: "dashboard/manage-users",
        element: <ManageUsersPage/>,
      },
      {
        path: "dashboard/approval-request",
        element: <ApprovalRequestPage/>,
      },
      {
        path: "dashboard/transactions/users/:id",
        element: <UserTransactionDetailsPage/>,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export default router;
