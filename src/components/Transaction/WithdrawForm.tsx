/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useWithdrawMutation } from "@/redux/features/Withdraw/withdrawApi";

export type TWithdraw = {
  type: "withdraw";
  amount: number;
  agentNumber: string;
  password: string;
};

// Validation Schema
const withdrawSchema = z.object({
  type: z.literal("withdraw"),
  amount: z.number().min(1, "Amount must be a number"),
  agentNumber: z.string().min(5, "Agent number is required"),
  password: z.string().min(1, "Password is required").max(5, "Password cannot exceed 5 digits").regex(/\d+/, "Password must contain only numbers"),
});

const WithdrawForm = () => {
  const [withdraw, { isLoading }] = useWithdrawMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TWithdraw>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { type: "withdraw" },
  });

  const onSubmit: SubmitHandler<TWithdraw> = async (data) => {
    const toastId = toast.loading("Processing withdrawal...");

    try {
      const res = await withdraw(data).unwrap();
      if (res.success) {
        reset();
        toast.success("Withdrawal successful!", { id: toastId, duration: 2000 });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || "Something went wrong!", { id: toastId, duration: 2000 });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Withdraw Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("type")} />
          <div>
            <Label htmlFor="agentNumber">Agent Number</Label>
            <Input
              id="agentNumber"
              {...register("agentNumber")}
              onChange={(e) =>
                setValue("agentNumber", e.target.value.replace(/^0+/, ""))
              }
            />
            {errors.agentNumber && <p className="text-red-500 text-sm">{errors.agentNumber.message}</p>}
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" id="amount" {...register("amount", { valueAsNumber: true })} />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Your Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Withdraw"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WithdrawForm;
