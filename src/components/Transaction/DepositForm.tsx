/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useDepositMutation } from "@/redux/features/Deposit/depositApi";
import { toast } from "sonner";

export type TDeposit = {
  type: "deposit";
  recipientNumber: string;
  amount: number;
  password: string;
};

// Validation Schema
const depositSchema = z.object({
  type: z.literal("deposit"),
  recipientNumber: z
    .string()
    .min(5, "Recipient number is required")
    .regex(/^[1-9]\d*$/, "Number cannot start with 0"),
  amount: z
    .number()
    .min(1, "Amount is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(5, "Password cannot exceed 5 digits")
    .regex(/^\d+$/, "Password must contain only numbers"),
});

const DepositForm = () => {
  const [deposit, { isLoading }] = useDepositMutation();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TDeposit>({
    resolver: zodResolver(depositSchema),
    defaultValues: { type: "deposit" },
  });

  const onSubmit: SubmitHandler<TDeposit> = async (data) => {
    const toastId = toast.loading("Processing deposit...");

    const formattedData = {
      ...data,
      recipientNumber: data.recipientNumber.replace(/^0+/, ""),
    };

    try {
      const res = await deposit(formattedData).unwrap();
      if (res.success) {
        reset()
        toast.success("Deposit successful!", { id: toastId, duration: 2000 });
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.error || "Something went wrong!";
      toast.error(errorMessage, { id: toastId, duration: 2000 });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Deposit Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden Type Input */}
          <input type="hidden" {...register("type")} />

          {/* Recipient Number */}
          <div>
            <Label htmlFor="recipientNumber">Recipient Number</Label>
            <Input
              id="recipientNumber"
              {...register("recipientNumber")}
              onChange={(e) =>
                setValue("recipientNumber", e.target.value.replace(/^0+/, ""))
              }
            />
            {errors.recipientNumber && (
              <p className="text-red-500 text-sm">{errors.recipientNumber.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              {...register("amount", { valueAsNumber: true })}
              onChange={(e) => {
                const value = Number(e.target.value);
                setValue("amount", isNaN(value) ? 0 : value);
              }}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          {/* Password with Toggle */}
          <div>
            <Label htmlFor="password">Your Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Deposit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DepositForm;
