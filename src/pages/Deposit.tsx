import DepositForm from "@/components/Transaction/DepositForm";

const DepositPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <DepositForm />
      </div>
    </div>
  );
};

export default DepositPage;
