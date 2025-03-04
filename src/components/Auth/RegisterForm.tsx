/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import loginImage from "@/assets/images/login-page.jpg";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "@/redux/features/Auth/authApi";

// Define Register Type
export type TRegister = {
  fullName: string;
  email: string;
  phoneNumber: string;
  nidNumber: string;
  password: string;
  role: "user" | "agent";
};

// Zod Schema Validation
const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[1-9]\d*$/, "Phone number cannot start with 0"),
  nidNumber: z.string().min(10, "NID must be at least 10 digits"),
  password: z
    .string()
    .min(5, "Password must be at least 5 digits")
    .max(5, "Password cannot exceed 5 digits")
    .regex(/^\d+$/, "Password must contain only numbers"),
  role: z.enum(["agent", "user"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle Form Submission
  const onSubmit: SubmitHandler<TRegister> = async (data) => {
    const toastId = toast.loading("Creating account...");
    const dataToRegister = {
      ...data,
      phoneNumber: data.phoneNumber.replace(/^0+/, ""),
    };

    try {
      const res = await registerUser(dataToRegister).unwrap();
      if (res.success) {
        toast.success("Account created successfully!", {
          id: toastId,
          duration: 2000,
        });
        navigate("/login");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.error || "Something went wrong!";
      toast.error(errorMessage, { id: toastId, duration: 2000 });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left-side Image */}
          <div className="relative bg-muted">
            <img
              src={loginImage}
              alt="Register Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>

          {/* Right-side Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-8 flex flex-col gap-6"
          >
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground">Join today!</p>
            </div>

            {/* Full Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="number"
                placeholder="Enter your phone number"
                {...register("phoneNumber")}
                onChange={(e) =>
                  setValue("phoneNumber", e.target.value.replace(/^0+/, ""))
                }
              />
              {errors.phoneNumber && (
                <span className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>

            {/* NID Number Input */}
            <div className="grid gap-2">
              <Label htmlFor="nidNumber">NID Number</Label>
              <Input
                id="nidNumber"
                placeholder="Enter your NID number"
                {...register("nidNumber")}
              />
              {errors.nidNumber && (
                <span className="text-red-500 text-sm">
                  {errors.nidNumber.message}
                </span>
              )}
            </div>

            {/* Password Input with Toggle */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
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
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Role Selection */}
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) =>
                  setValue("role", value as "user" | "agent")
                }
                defaultValue={undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>

              {errors.role && (
                <span className="text-red-500 text-sm">
                  {errors.role.message}
                </span>
              )}
            </div>

            {/* Register Button */}
            <Button type="submit" className="w-full">
              Register
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
