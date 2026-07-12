"use client";

import { useState, memo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Bell, Search, LogOut, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuClick: () => void;
}

const moduleNav = [
  { label: "Dashboard", href: "/dashboard", match: ["/dashboard"] },
  { label: "Environmental", href: "/environmental", match: ["/environmental", "/carbon", "/settings/emission-factors", "/settings/product-profiles", "/settings/goals"] },
  { label: "Social", href: "/social", match: ["/social", "/csr"] },
  { label: "Governance", href: "/governance", match: ["/governance", "/audits", "/settings/policies", "/settings/policy-acknowledgements"] },
  { label: "Gamification", href: "/gamification", match: ["/gamification", "/challenges"] },
  { label: "Reports", href: "/reports/custom", match: ["/reports"] },
  { label: "Settings", href: "/settings/departments", match: ["/settings/departments", "/settings/categories", "/settings/esg-config", "/notifications", "/profile"] },
];

export const Topbar = memo(function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const activeModule = moduleNav.find((m) =>
    m.match.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"))
  )?.href ?? "/dashboard";

  const activeModuleLabel = moduleNav.find((m) => activeModule === m.href)?.label ?? "Dashboard";

  const toggleSearch = useCallback(() => setShowSearch((s) => !s), []);
  const handleLogout = useCallback(() => { logout(); }, [logout]);

  return (
    <header className="sticky top-0 z-30 flex flex-col border-b bg-background shadow-sm">
      {/* Top row */}
      <div className="flex h-12 items-center gap-3 px-4">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* App label - dynamic based on active module */}
        <span className="hidden md:inline-flex text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
          EcoSphere: {activeModuleLabel}
        </span>

        {/* Search */}
        <div className={cn("flex-1", showSearch ? "block" : "hidden md:block")}>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 h-7 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Search toggle for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-7 w-7"
            onClick={toggleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-7 w-7">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-7 gap-1.5 pl-1.5 pr-1.5">
                <Avatar className="h-6 w-6">
                  {user?.avatar && <AvatarImage src={user.avatar} />}
                  <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden text-xs font-medium md:inline-block">
                  {user?.name || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/departments">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <nav className="flex items-center gap-0 overflow-x-auto border-t px-4 scrollbar-none">
        {moduleNav.map((m) => {
          const isActive = activeModule === m.href;
          return (
            <Link
              key={m.href}
              href={m.href}
              className={cn(
                "inline-flex items-center whitespace-nowrap px-3 py-2 text-xs font-medium border-b-2 transition-colors",
                isActive
                  ? "border-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active))]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              {m.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
});
