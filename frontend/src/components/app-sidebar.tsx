"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListChecks,
  TrendingUp,
} from "lucide-react";

import { LogoMark } from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Problems",
    href: "/problems",
    icon: ListChecks,
  },
  {
    label: "Progress",
    href: "/progress",
    icon: TrendingUp,
  },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "group/sidebar fixed left-0 top-0 z-40 h-screen shrink-0 overflow-visible border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* ── Floating edge toggle ── */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3.5 top-16 z-50 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-sidebar-border bg-background text-sidebar-foreground shadow-sm transition-all hover:scale-110 hover:shadow-md"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <ChevronLeft className="size-3.5" />
        )}
      </button>

      {/* ── Inner scrollable container ── */}
      <div className="ui-scrollbar flex h-full flex-col overflow-y-auto overflow-x-hidden">
        {/* ── Header ── */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b transition-all duration-300",
            collapsed ? "justify-center px-2" : "px-4",
          )}
        >
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            <LogoMark
              size={28}
              className="shrink-0"
            />
            <p
              className={cn(
                "whitespace-nowrap text-sm font-semibold tracking-wide transition-all duration-300",
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
              )}
            >
              ThinkDSA
            </p>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className={cn("space-y-2 p-3", collapsed && "px-2")}> 
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: isActive ? "default" : "ghost" }),
                  "overflow-hidden",
                  collapsed ? "h-10 w-12 justify-center px-0" : "w-full justify-start gap-2",
                  !isActive && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                title={item.label}
                aria-label={item.label}
              >
                <Icon className="size-4 shrink-0" />
                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-300",
                    collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
