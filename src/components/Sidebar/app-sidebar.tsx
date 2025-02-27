import * as React from "react";
import {
  FolderOutput,
  HandCoins,
  LayoutDashboard,
  Send,
  LucideIcon,
  ArrowRightLeft,
  Users,
  GitPullRequestArrow, // ✅ Import LucideIcon for correct type usage
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useUser } from "@/hooks/useUser";

// Define user roles
type UserRole = "user" | "agent" | "admin";

// Define the structure of the navigation items
type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon; // ✅ Ensuring correct type compatibility
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

// Define navigation data
const navigationData: Record<UserRole, NavItem[]> = {
  user: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Transfer", url: "/dashboard/transfer-money", icon: Send },
    { title: "Withdraw", url: "/dashboard/withdraw-money", icon: FolderOutput },
    { title: "Transactions", url: "/dashboard/transactions", icon: ArrowRightLeft },
  ],
  agent: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Deposit", url: "/dashboard/deposit-money", icon: HandCoins },
    { title: "Transactions", url: "/dashboard/transactions", icon: ArrowRightLeft },
  ],
  admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Deposit", url: "/dashboard/deposit-money", icon: HandCoins },
    { title: "Transactions", url: "/dashboard/transactions", icon: ArrowRightLeft },
    { title: "Manage User", url: "/dashboard/manage-users", icon: Users },
    { title: "Approval Request", url: "/dashboard/approval-request", icon: GitPullRequestArrow },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

  // Ensure userRole is a valid key for navigationData
  const userRole: UserRole = (user?.role as UserRole) || "user";
  const navItems = navigationData[userRole];

  return (
    <Sidebar className="bg-white" collapsible="icon" {...props}>
      <SidebarContent className="bg-white">
        <NavMain items={navItems} /> 
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
