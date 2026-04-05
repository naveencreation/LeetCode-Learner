"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const isTraversalPage =
    pathname.startsWith("/problems/binary-tree/inorder-traversal") ||
    pathname.startsWith("/problems/binary-tree/preorder-traversal") ||
    pathname.startsWith("/problems/binary-tree/postorder-traversal") ||
    pathname.startsWith("/problems/binary-tree/preorder-inorder-postorder-in-a-single-traversal") ||
    pathname.startsWith("/problems/binary-tree/leftview-of-binary-tree") ||
    pathname.startsWith("/problems/binary-tree/bottom-view-of-binary-tree") ||
    pathname.startsWith("/problems/binary-tree/top-view-of-binary-tree") ||
    pathname.startsWith("/problems/binary-tree/vertical-order-traversal") ||
    pathname.startsWith("/problems/binary-tree/root-to-node-path-in-a-binary-tree") ||
    pathname.startsWith("/problems/binary-tree/max-width-of-a-binary-tree");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
      />
      <main
        className={
          isTraversalPage
            ? `flex h-screen flex-1 flex-col overflow-hidden p-4 md:p-5 ${collapsed ? "ml-16" : "ml-64"}`
            : `flex-1 p-6 md:p-8 ${collapsed ? "ml-16" : "ml-64"}`
        }
      >
        {children}
      </main>
    </div>
  );
}
