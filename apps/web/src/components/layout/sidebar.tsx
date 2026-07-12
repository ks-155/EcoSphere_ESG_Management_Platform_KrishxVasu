"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { memo } from "react";
import {
  Leaf,
  Users,
  Shield,
  Settings2,
  FileBarChart,
  Trophy,
  Building2,
  Tags,
  FlaskConical,
  Target,
  Medal,
  Gift,
  BarChart3,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Activity,
  ClipboardCheck,
  AlertTriangle,
  Cloud,
  Bell,
  Handshake,
  Calculator,
  Swords,
  FileText,
  LayoutDashboard,
  Package,
  CircleUser,
} from "lucide-react";

const navGroups = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Environmental",
    icon: Leaf,
    items: [
      { label: "Emission Factors", href: "/settings/emission-factors", icon: FlaskConical },
      { label: "Product ESG Profiles", href: "/settings/product-profiles", icon: Package },
      { label: "Carbon Transactions", href: "/carbon/entries", icon: Cloud },
      { label: "Environmental Goals", href: "/settings/goals", icon: Target },
    ],
  },
  {
    label: "Social",
    icon: Users,
    items: [
      { label: "CSR Activities", href: "/csr/initiatives", icon: Activity },
      { label: "Employee Participation", href: "/csr/participation", icon: Handshake },
      { label: "Diversity Dashboard", href: "/social", icon: Users },
    ],
  },
  {
    label: "Governance",
    icon: Shield,
    items: [
      { label: "Policies", href: "/settings/policies", icon: FileText },
      { label: "Policy Acknowledgements", href: "/settings/policy-acknowledgements", icon: ScrollText },
      { label: "Audits", href: "/audits/schedules", icon: ClipboardCheck },
      { label: "Compliance Issues", href: "/audits/compliance", icon: AlertTriangle },
    ],
  },
  {
    label: "Gamification",
    icon: Trophy,
    items: [
      { label: "Challenges", href: "/gamification", icon: Swords },
      { label: "Challenge Participation", href: "/challenges/submissions", icon: ScrollText },
      { label: "Badges", href: "/gamification/badges", icon: Medal },
      { label: "Rewards", href: "/gamification/rewards", icon: Gift },
      { label: "Leaderboard", href: "/gamification/leaderboard", icon: BarChart3 },
    ],
  },
  {
    label: "Reports",
    icon: FileBarChart,
    items: [
      { label: "Environmental Report", href: "/reports/custom?type=environmental", icon: Leaf },
      { label: "Social Report", href: "/reports/custom?type=social", icon: Users },
      { label: "Governance Report", href: "/reports/custom?type=governance", icon: Shield },
      { label: "ESG Summary", href: "/reports/custom?type=esg", icon: Calculator },
      { label: "Custom Report Builder", href: "/reports/custom", icon: FileBarChart },
    ],
  },
  {
    label: "Settings",
    icon: Settings2,
    items: [
      { label: "Departments", href: "/settings/departments", icon: Building2 },
      { label: "Categories", href: "/settings/categories", icon: Tags },
      { label: "ESG Configuration", href: "/settings/esg-config", icon: Settings2 },
      { label: "Notification Settings", href: "/notifications", icon: Bell },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = memo(function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between px-3 shrink-0">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-[hsl(var(--sidebar-active))]" />
            <span className="text-base font-bold tracking-tight">EcoSphere</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Leaf className="h-5 w-5 text-[hsl(var(--sidebar-active))]" />
          </Link>
        )}
      </div>

      <Separator className="bg-sidebar-muted" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-3">
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
                {group.label}
              </p>
            )}
            {collapsed && (
              <div className="flex justify-center mb-1">
                <group.icon className="h-3 w-3 text-sidebar-muted" />
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href.split("?")[0] + "/");
                return (
                  <li key={`${group.label}-${item.label}`}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-xs transition-colors",
                        isActive
                          ? "bg-[hsl(var(--sidebar-active))] text-white font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-muted p-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground text-xs h-7"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          {!collapsed && <span className="ml-1.5 text-xs">Collapse</span>}
        </Button>
      </div>
    </aside>
  );
});
