/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginImage from "@/assets/images/login-page.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/redux/features/Auth/authApi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { verifyToken } from "@/utils/verifyToken";
import { setUser } from "@/redux/features/Auth/authSlice";

type TLoginData = {
  phoneNumber: string;
  password: string;
};

// Zod Schema Validation
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[1-9]\d*$/, "Phone number cannot start with 0"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(5, "Password cannot exceed 5 digits")
    .regex(/^\d+$/, "Password must contain only numbers"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginUser] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema), // Use Zod Resolver
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<TLoginData> = async (data) => {
    const dataToLogin = {
      ...data,
      phoneNumber: data.phoneNumber.replace(/^0+/, ""),
    };

    const toastId = toast.loading("Logging in");
    try {
      const res = await loginUser(dataToLogin).unwrap();
      if (res.success) {
        const user = verifyToken(res.data.token);
        dispatch(setUser({ user: user, token: res.data.token }));

        toast.success("Logged in", { id: toastId, duration: 2000 });
        navigate("/");
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
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">
                  Login to your Acme Inc account
                </p>
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

              {/* Password Input with Toggle */}
              <div className="grid gap-2">
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

              {/* Login Button */}
              <Button type="submit" className="w-full">
                Login
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          {/* Right-side Image (hidden on small screens) */}
          <div className="relative hidden bg-muted md:block">
            <img
              src={loginImage}
              alt="Login Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
