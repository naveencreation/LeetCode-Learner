"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";

const traversalRoutes = [
  "/problems/binary-tree/inorder-traversal",
  "/problems/binary-tree/preorder-traversal",
  "/problems/binary-tree/postorder-traversal",
  "/problems/binary-tree/preorder-inorder-postorder-in-a-single-traversal",
  "/problems/binary-tree/leftview-of-binary-tree",
  "/problems/binary-tree/bottom-view-of-binary-tree",
  "/problems/binary-tree/top-view-of-binary-tree",
  "/problems/binary-tree/vertical-order-traversal",
  "/problems/binary-tree/root-to-node-path-in-a-binary-tree",
  "/problems/binary-tree/max-width-of-a-binary-tree",
  "/problems/binary-tree/level-order-traversal",
  "/problems/binary-tree/height-of-a-binary-tree",
  "/problems/binary-tree/diameter-of-binary-tree",
  "/problems/binary-tree/lca-in-binary-tree",
  "/problems/binary-tree/balanced-binary-tree",
  "/problems/binary-tree/same-tree",
  "/problems/binary-tree/symmetric-tree",
  "/problems/binary-tree/boundary-of-binary-tree",
  "/problems/binary-tree/zigzag-level-order",
  "/problems/binary-tree/zigzag-level-order-traversal",
  "/problems/binary-tree/construct-binary-tree-from-inorder-and-preorder",
  "/problems/binary-tree/construct-binary-tree-from-inorder-and-postorder",
  "/problems/binary-tree/flatten-binary-tree-to-linkedlist",
  "/problems/binary-tree/convert-bst-to-sorted-doubly-linked-list",
  // Linked List visualizers
  "/problems/linked-list/reverse-a-linkedlist",
] as const;

export default function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const isGuidePage = pathname.endsWith("-guide");
  const isTraversalPage =
    !isGuidePage && traversalRoutes.some((route) => pathname.startsWith(route));
  const isBinaryTreeProblemRoute = pathname.startsWith("/problems/binary-tree/");
  const isLinkedListProblemRoute = pathname.startsWith("/problems/linked-list/");
  const isProblemFocusPage = isTraversalPage || isBinaryTreeProblemRoute || isLinkedListProblemRoute;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {!isProblemFocusPage ? (
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((previous) => !previous)}
        />
      ) : null}
      <main
        className={
          isTraversalPage
            ? "flex h-screen flex-1 flex-col overflow-hidden p-0"
            : isProblemFocusPage
            ? "flex min-h-screen flex-1 flex-col overflow-y-auto p-0"
            : `flex-1 p-6 md:p-8 transition-[margin] duration-300 ease-in-out ${collapsed ? "ml-16" : "ml-64"}`
        }
      >
        {children}
      </main>
    </div>
  );
}
