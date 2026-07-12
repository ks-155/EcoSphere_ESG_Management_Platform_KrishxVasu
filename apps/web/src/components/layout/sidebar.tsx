"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Package,
  Target,
  FileText,
  Medal,
  Gift,
  BarChart3,
  TreePine,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Activity,
  Swords,
  ClipboardCheck,
  AlertTriangle,
  FileSearch,
  Cloud,
  Bell,
  Handshake,
  Calculator,
  TicketCheck,
  Award,
  LayoutDashboard,
  Home,
} from "lucide-react";

const navGroups = [
  {
    label: "Dashboard",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Environmental", href: "/environmental", icon: Leaf },
      { label: "Social", href: "/social", icon: Users },
      { label: "Governance", href: "/governance", icon: Shield },
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
    label: "Carbon Management",
    items: [
      { label: "Carbon Entries", href: "/carbon/entries", icon: Cloud },
      { label: "Net Zero Target", href: "/carbon/net-zero", icon: TreePine },
    ],
  },
  {
    label: "CSR & Challenges",
    items: [
      { label: "CSR Initiatives", href: "/csr/initiatives", icon: Activity },
      { label: "CSR Participation", href: "/csr/participation", icon: Handshake },
      { label: "Challenge Templates", href: "/challenges/templates", icon: Swords },
      { label: "Submissions", href: "/challenges/submissions", icon: ScrollText },
    ],
  },
  {
    label: "Audits & Compliance",
    items: [
      { label: "Audit Schedules", href: "/audits/schedules", icon: ClipboardCheck },
      { label: "Compliance Issues", href: "/audits/compliance", icon: AlertTriangle },
      { label: "Audit Reports", href: "/audits/reports", icon: FileSearch },
    ],
  },
  {
    label: "ESG Scores",
    items: [
      { label: "Department Scores", href: "/esg/department-scores", icon: Calculator },
    ],
  },
  {
    label: "Gamification",
    items: [
      { label: "Hub", href: "/gamification", icon: Trophy },
      { label: "Badges", href: "/gamification/badges", icon: Medal },
      { label: "User Badges", href: "/gamification/user-badges", icon: Award },
      { label: "Rewards", href: "/gamification/rewards", icon: Gift },
      { label: "Redemptions", href: "/gamification/redemptions", icon: TicketCheck },
      { label: "Leaderboard", href: "/gamification/leaderboard", icon: BarChart3 },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "ESG Config", href: "/settings/esg-config", icon: Settings2 },
      { label: "Policy Acknowledgements", href: "/settings/policy-acknowledgements", icon: FileText },
      { label: "Notifications", href: "/notifications", icon: Bell },
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
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[hsl(var(--sidebar-active))]" />
            <span className="text-lg font-bold">EcoSphere</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
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
                  <li key={`${group.label}-${item.label}`}>
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
