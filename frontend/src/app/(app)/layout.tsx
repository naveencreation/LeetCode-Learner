"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isTraversalPage =
    pathname.startsWith("/problems/binary-tree/inorder-traversal") ||
    pathname.startsWith("/problems/binary-tree/preorder-traversal") ||
    pathname.startsWith("/problems/binary-tree/postorder-traversal") ||
    pathname.startsWith("/problems/binary-tree/leftview-of-binary-tree");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar />
      <main
        className={
          isTraversalPage
            ? "flex h-screen flex-1 flex-col overflow-hidden p-4 md:p-5"
            : "flex-1 p-6 md:p-8"
        }
      >
        {children}
      </main>
    </div>
  );
}
