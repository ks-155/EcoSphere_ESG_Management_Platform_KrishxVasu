"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

function pathToBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    environmental: "Environmental",
    social: "Social",
    governance: "Governance",
    settings: "Settings",
    departments: "Departments",
    categories: "Categories",
    "emission-factors": "Emission Factors",
    "product-profiles": "Product Profiles",
    goals: "Goals",
    policies: "Policies",
    "policy-acknowledgements": "Policy Acknowledgements",
    "esg-config": "ESG Configuration",
    carbon: "Carbon",
    entries: "Entries",
    "net-zero": "Net Zero Target",
    csr: "CSR",
    initiatives: "Initiatives",
    participation: "Participation",
    challenges: "Challenges",
    templates: "Templates",
    submissions: "Submissions",
    audits: "Audits",
    schedules: "Schedules",
    compliance: "Compliance",
    reports: "Reports",
    esg: "ESG",
    "department-scores": "Department Scores",
    gamification: "Gamification",
    badges: "Badges",
    "user-badges": "User Badges",
    rewards: "Rewards",
    redemptions: "Redemptions",
    leaderboard: "Leaderboard",
    hub: "Hub",
    custom: "Custom Builder",
    notifications: "Notifications",
    profile: "Profile",
    audit: "Audit",
  };

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    breadcrumbs.push({
      label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href: path,
    });
  }

  return breadcrumbs;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = pathToBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1 && breadcrumbs[0]?.href === "/dashboard") return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {breadcrumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {i === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
