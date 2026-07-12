"use client";

import { useState, useCallback, memo } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout — memoized to prevent re-renders from parent state changes.
 * Uses margin-left transition ONLY (not transition-all) to avoid
 * triggering expensive full-layout recalculations on every frame.
 */
export const MainLayout = memo(function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Stable callbacks — prevents Sidebar/Topbar from re-rendering on collapse
  const handleToggle = useCallback(() => setCollapsed((c) => !c), []);
  const handleMobileOpen = useCallback(() => setMobileOpen(true), []);
  const handleMobileClose = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar — fixed position, GPU composited layer */}
      <div className="hidden md:block" aria-hidden={false}>
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      </div>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-60">
          <Sidebar collapsed={false} onToggle={handleMobileClose} />
        </SheetContent>
      </Sheet>

      {/* Main content — only margin-left transitions (no layout thrashing) */}
      <div
        className={cn(
          "content-area",   /* class defined in globals.css for optimized transition */
          collapsed ? "md:ml-16" : "md:ml-60"
        )}
      >
        <Topbar onMenuClick={handleMobileOpen} />
        {/* content-section enables content-visibility: auto for off-screen sections */}
        <main className="p-4 sm:p-5 content-section">
          {children}
        </main>
      </div>
    </div>
  );
});
