"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Leaf,
  Users,
  Shield,
  Settings2,
  FileBarChart,
  Trophy,
  ArrowLeftRight,
  Building2,
  Tags,
  FlaskConical,
  Package,
  Target,
  FileText,
  Medal,
  Gift,
  BarChart3,
  TreePine,
  ScrollText,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navGroups = [
  {
    label: "Dashboard",
    items: [
      { label: "Environmental", href: "/settings/goals", icon: Leaf },
      { label: "Social", href: "/settings/departments", icon: Users },
      { label: "Governance", href: "/settings/policies", icon: Shield },
    ],
  },
  {
    label: "Master Data",
    items: [
      { label: "Departments", href: "/settings/departments", icon: Building2 },
      { label: "Categories", href: "/settings/categories", icon: Tags },
      { label: "Emission Factors", href: "/settings/emission-factors", icon: FlaskConical },
      { label: "Product Profiles", href: "/settings/product-profiles", icon: Package },
      { label: "Goals", href: "/settings/goals", icon: Target },
      { label: "Policies", href: "/settings/policies", icon: FileText },
    ],
  },
  {
    label: "Transactions",
    items: [
      { label: "Carbon", href: "/settings/emission-factors", icon: TreePine },
      { label: "CSR Activities", href: "/settings/categories", icon: ScrollText },
      { label: "Participation", href: "/settings/departments", icon: Users },
      { label: "Challenges", href: "/gamification/badges", icon: Award },
      { label: "Challenge Participation", href: "/gamification/rewards", icon: ArrowLeftRight },
      { label: "Policy Acks", href: "/settings/policies", icon: FileText },
      { label: "Audits", href: "/settings/goals", icon: Shield },
      { label: "Compliance", href: "/settings/product-profiles", icon: Shield },
    ],
  },
  {
    label: "Gamification",
    items: [
      { label: "Hub", href: "/gamification/badges", icon: Trophy },
      { label: "Badges", href: "/gamification/badges", icon: Medal },
      { label: "Rewards", href: "/gamification/rewards", icon: Gift },
      { label: "Leaderboard", href: "/gamification/leaderboard", icon: BarChart3 },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Environmental", href: "/settings/goals", icon: Leaf },
      { label: "Social", href: "/settings/departments", icon: Users },
      { label: "Governance", href: "/settings/policies", icon: Shield },
      { label: "ESG Summary", href: "/settings/categories", icon: FileBarChart },
      { label: "Custom Builder", href: "/settings/emission-factors", icon: Settings2 },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "ESG Config", href: "/settings/departments", icon: Settings2 },
      { label: "Notifications", href: "/settings/categories", icon: Settings2 },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/settings/departments" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[hsl(var(--sidebar-active))]" />
            <span className="text-lg font-bold">EcoSphere</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/settings/departments" className="mx-auto">
            <Leaf className="h-6 w-6 text-[hsl(var(--sidebar-active))]" />
          </Link>
        )}
      </div>

      <Separator className="bg-sidebar-muted" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-medium uppercase text-sidebar-muted">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-[hsl(var(--sidebar-active))] text-white"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
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
      <div className="border-t border-sidebar-muted p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}
