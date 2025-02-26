/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useTransferMutation } from "@/redux/features/Transfer/transferApi";

export type TTransfer = {
  type: "transfer";
  recipientNumber: string;
  amount: number;
  password: string;
};

// Validation Schema
const transferSchema = z.object({
  type: z.literal("transfer"),
  recipientNumber: z
    .string()
    .min(5, "Recipient number is required")
    .regex(/^[1-9]\d*$/, "Number cannot start with 0"),
  amount: z
    .preprocess((val) => Number(val), z.number().min(50, "Minimum amount is 50")),
  password: z
    .string()
    .min(1, "Password is required")
    .max(5, "Password cannot exceed 5 digits")
    .regex(/^\d+$/, "Password must contain only numbers"),
});

const TransferForm = () => {
  const [transfer, { isLoading }] = useTransferMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TTransfer>({
    resolver: zodResolver(transferSchema),
    defaultValues: { type: "transfer" }, // ✅ Fixed!
  });


 const onSubmit: SubmitHandler<TTransfer> = async (data) => {
  const formattedData = {
    ...data,
    type: "transfer", 
    recipientNumber: data.recipientNumber.replace(/^0+/, ""),
  };
  const toastId = toast.loading("Processing transfer...");

  try {
    const res = await transfer(formattedData).unwrap();
    if (res.success) {
      reset();
      toast.success("Money Transfer successful!", { id: toastId, duration: 2000 });
    }
  } catch (error: any) {
    toast.error(error?.data?.message || "Something went wrong!", { id: toastId, duration: 2000 });
  }
};

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Transfer Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("type")} />

          {/* Show validation errors safely */}
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500 text-sm">
              {Object.entries(errors).map(([key, value]) => (
                <p key={key}>{key}: {value.message?.toString()}</p>
              ))}
            </div>
          )}

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

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              {...register("amount")}
              onChange={(e) => setValue("amount", Number(e.target.value))}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

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
            {isLoading ? "Processing..." : "Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransferForm;
