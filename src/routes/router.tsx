import App from "@/App";
import DashboardPage from "@/pages/Dashboard";
import DepositPage from "@/pages/Deposit";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import TransferPage from "@/pages/Transfer";
import WithdrawPage from "@/pages/Withdraw";
import {
    createBrowserRouter,
  } from "react-router-dom";


const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
    },
    {
      path: "/dashboard",
      element: <App/>,
      children: [
        {
          path: "deposit",
          element: <DepositPage/>
        },
        {
          path: "withdraw",
          element: <WithdrawPage/>
        },
        {
          path: "transfer",
          element: <TransferPage/>
        },
      ]
    },
    {
      path: "/login",
      element: <LoginPage/>,
    },
    {
      path: "/register",
      element: <RegisterPage/>,
    },
  ]);



  export default router;