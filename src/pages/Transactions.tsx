import TransactionsAdminTable from "@/components/Transaction/TransactionsAdminTable";
import TransactionsAgentTable from "@/components/Transaction/TransactionsAgentTable";
import TransactionsUserTable from "@/components/Transaction/TransactionsUserTable";
import { useUser } from "@/hooks/useUser";

const TransactionsPage = () => {
  const user = useUser();

  return (
    <div>
      {user?.role === "admin" && <TransactionsAdminTable />}
      {user?.role === "agent" && <TransactionsAgentTable />}
      {user?.role === "user" && <TransactionsUserTable />}
    </div>
  );
};

export default TransactionsPage;
