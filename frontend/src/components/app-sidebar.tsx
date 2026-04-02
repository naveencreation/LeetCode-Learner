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
        "ui-scrollbar fixed left-0 top-0 z-40 h-screen shrink-0 overflow-y-auto border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b transition-all duration-300",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {!collapsed ? (
          <div className="flex min-w-0 items-center gap-2">
            <img
              src="/codearena-mark.svg"
              alt="CodeArena logo"
              className="h-7 w-7 shrink-0"
            />
            <p className="truncate text-sm font-semibold tracking-wide">CodeArena</p>
          </div>
        ) : (
          <img
            src="/codearena-mark.svg"
            alt="CodeArena logo"
            className="h-7 w-7 shrink-0"
          />
        )}

        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-background text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

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
                collapsed ? "h-10 w-12 justify-center px-0" : "w-full justify-start gap-2",
                !isActive && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="size-4" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
