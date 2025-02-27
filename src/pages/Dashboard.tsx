/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Loader from "@/components/Loaders/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { useTransactionsCountQuery } from "@/redux/features/Transaction/transactionApi";
import { useGetUserByIdQuery, useUserCountQuery } from "@/redux/features/User/userApi";
import { DollarSign, Users, CreditCard, BarChart } from "lucide-react";

const DashboardPage = () => {
  const user = useUser();

  // State for toggling visibility
  const [showBalance, setShowBalance] = useState(false);
  const [showIncome, setShowIncome] = useState(false);

  // Queries (always called to follow React Hook rules)
  const { data: userCountData, isLoading: isLoadingUsers } = useUserCountQuery(0);
  const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactionsCountQuery(0);
  const { data: currentUserData, isLoading: isLoadingCurrentUser } = useGetUserByIdQuery({ id: user?.userId });

  // Show loader while fetching data
  if (isLoadingUsers || isLoadingTransactions || isLoadingCurrentUser) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader />
      </div>
    );
  }

  // Ensure safe fallback values
  const totalUsers = userCountData?.data?.totalUsers ?? 0;
  const totalTransactions = transactionsData?.data?.totalTransaction ?? 0;
  const totalMoney = currentUserData?.data?.totalMoney ?? 0;
  const balance = currentUserData?.data?.balance ?? 0;
  const income = currentUserData?.data?.income ?? 0; // Assuming `income` exists for agents

  // Function to toggle visibility
  const toggleBalance = () => setShowBalance(!showBalance);
  const toggleIncome = () => setShowIncome(!showIncome);

  // Define dashboard cards dynamically based on role
  let cards: { title: string; value: string | JSX.Element; icon: JSX.Element; onClick?: () => void }[] = [];

  if (user?.role === "admin") {
    cards = [
      { title: "Total Money", value: `${totalMoney.toLocaleString()} BDT`, icon: <DollarSign className="w-8 h-8 text-blue-500" /> },
      { title: "Balance", value: `${balance.toLocaleString()} BDT`, icon: <CreditCard className="w-8 h-8 text-green-500" /> },
      { title: "Total Users", value: totalUsers.toLocaleString(), icon: <Users className="w-8 h-8 text-purple-500" /> },
      { title: "Total Transactions", value: totalTransactions.toLocaleString(), icon: <BarChart className="w-8 h-8 text-red-500" /> },
    ];
  } else if (user?.role === "agent") {
    cards = [
      { title: "Balance", value: showBalance ? `${balance.toLocaleString()} BDT` : "**** BDT", icon: <CreditCard className="w-8 h-8 text-green-500" />, onClick: toggleBalance },
      { title: "Income", value: showIncome ? `${income.toLocaleString()} BDT` : "**** BDT", icon: <DollarSign className="w-8 h-8 text-orange-500" />, onClick: toggleIncome },
    ];
  } else if (user?.role === "user") {
    cards = [
      { title: "Balance", value: showBalance ? `${balance.toLocaleString()} BDT` : "**** BDT", icon: <CreditCard className="w-8 h-8 text-green-500" />, onClick: toggleBalance },
    ];
  }

  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="shadow-sm border border-gray-200 bg-white rounded-2xl p-1 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={card.onClick} // Attach click handler only if applicable
          >
            <CardHeader className="">
              {card.icon}
              <CardTitle className="text-lg font-semibold text-gray-700">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
