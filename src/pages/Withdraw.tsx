import WithdrawForm from '@/components/Transaction/WithdrawForm';

const WithdrawPage = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <WithdrawForm />
      </div>
    </div>
    );
};

export default WithdrawPage;