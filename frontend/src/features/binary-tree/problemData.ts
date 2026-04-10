export interface BinaryTreeProblemEntry {
  slug: string;
  title: string;
  intuition: string;
  pythonCode: string;
}

export const binaryTreeProblemData: Record<string, BinaryTreeProblemEntry> = {
  "leftview-of-binary-tree": {
    slug: "leftview-of-binary-tree",
    title: "Left View of Binary Tree",
    intuition:
      "Run level-order traversal and capture the first node of every level.",
    pythonCode: `from collections import deque

class Solution:
    def leftView(self, root):
        if not root:
            return []

        ans = []
        q = deque([root])

        while q:
            level_size = len(q)
            for i in range(level_size):
                node = q.popleft()
                if i == 0:
                    ans.append(node.data)

                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)

        return ans`,
  },
  "balanced-binary-tree": {
    slug: "balanced-binary-tree",
    title: "Balanced Binary Tree",
    intuition:
      "Use bottom-up DFS to compute height and check balance simultaneously. Return -1 as sentinel when unbalanced.",
    pythonCode: `class Solution:
    def isBalanced(self, root):
        def check(node):
            if not node:
                return 0

            left = check(node.left)
            if left == -1:
                return -1

            right = check(node.right)
            if right == -1:
                return -1

            if abs(left - right) > 1:
                return -1

            return 1 + max(left, right)

        return check(root) != -1`,
  },
    "lca-in-binary-tree": {
        slug: "lca-in-binary-tree",
        title: "Lowest Common Ancestor in Binary Tree",
        intuition:
            "Use one DFS traversal. If both left and right return non-null, current node is LCA; otherwise propagate non-null result.",
        pythonCode: `class Solution:
        def lowestCommonAncestor(self, root, p, q):
                if not root or root is p or root is q:
                        return root

                left = self.lowestCommonAncestor(root.left, p, q)
                right = self.lowestCommonAncestor(root.right, p, q)

                if left and right:
                        return root

                return left if left else right`,
    },
  "bottom-view-of-binary-tree": {
    slug: "bottom-view-of-binary-tree",
    title: "Bottom View of Binary Tree",
    intuition:
      "Use BFS with horizontal distance. Keep overwriting each distance so the deepest node remains.",
    pythonCode: `from collections import deque

class Solution:
    def bottomView(self, root):
        if not root:
            return []

        hd_to_val = {}
        q = deque([(root, 0)])

        while q:
            node, hd = q.popleft()
            hd_to_val[hd] = node.data

            if node.left:
                q.append((node.left, hd - 1))
            if node.right:
                q.append((node.right, hd + 1))

        return [hd_to_val[hd] for hd in sorted(hd_to_val)]`,
  },
  "top-view-of-binary-tree": {
    slug: "top-view-of-binary-tree",
    title: "Top View of Binary Tree",
    intuition:
      "Use BFS with horizontal distance. Keep the first node encountered at each distance.",
    pythonCode: `from collections import deque

class Solution:
    def topView(self, root):
        if not root:
            return []

        hd_to_val = {}
        q = deque([(root, 0)])

        while q:
            node, hd = q.popleft()
            if hd not in hd_to_val:
                hd_to_val[hd] = node.data

            if node.left:
                q.append((node.left, hd - 1))
            if node.right:
                q.append((node.right, hd + 1))

        return [hd_to_val[hd] for hd in sorted(hd_to_val)]`,
  },
  "preorder-inorder-postorder-in-a-single-traversal": {
    slug: "preorder-inorder-postorder-in-a-single-traversal",
    title: "Preorder Inorder Postorder in a Single Traversal",
    intuition:
      "Use one stack with state (1,2,3) for node processing stage: preorder -> inorder -> postorder.",
    pythonCode: `class Solution:
    def allTraversals(self, root):
        if not root:
            return [], [], []

        pre, ino, post = [], [], []
        st = [(root, 1)]

        while st:
            node, state = st.pop()

            if state == 1:
                pre.append(node.data)
                st.append((node, 2))
                if node.left:
                    st.append((node.left, 1))
            elif state == 2:
                ino.append(node.data)
                st.append((node, 3))
                if node.right:
                    st.append((node.right, 1))
            else:
                post.append(node.data)

        return pre, ino, post`,
  },
  "vertical-order-traversal": {
    slug: "vertical-order-traversal",
    title: "Vertical Order Traversal",
    intuition:
      "BFS over nodes with (column, row). Group by column and sort by row/value rules.",
    pythonCode: `from collections import defaultdict, deque

class Solution:
    def verticalTraversal(self, root):
        if not root:
            return []

        cols = defaultdict(list)
        q = deque([(root, 0, 0)])

        while q:
            node, r, c = q.popleft()
            cols[c].append((r, node.data))

            if node.left:
                q.append((node.left, r + 1, c - 1))
            if node.right:
                q.append((node.right, r + 1, c + 1))

        ans = []
        for c in sorted(cols):
            bucket = sorted(cols[c], key=lambda x: (x[0], x[1]))
            ans.append([val for _, val in bucket])

        return ans`,
  },
  "root-to-node-path-in-a-binary-tree": {
    slug: "root-to-node-path-in-a-binary-tree",
    title: "Root to Node Path in a Binary Tree",
    intuition:
      "DFS with backtracking. Push node, recurse, and pop if target not found.",
    pythonCode: `class Solution:
    def solve(self, root, target):
        path = []

        def dfs(node):
            if not node:
                return False

            path.append(node.data)
            if node.data == target:
                return True

            if dfs(node.left) or dfs(node.right):
                return True

            path.pop()
            return False

        return path if dfs(root) else []`,
  },
  "max-width-of-a-binary-tree": {
    slug: "max-width-of-a-binary-tree",
    title: "Max Width of a Binary Tree",
    intuition:
      "Level-order traversal with virtual indices (like heap indexing) to measure span.",
    pythonCode: `from collections import deque

class Solution:
    def widthOfBinaryTree(self, root):
        if not root:
            return 0

        q = deque([(root, 0)])
        ans = 0

        while q:
            level_size = len(q)
            _, first = q[0]
            _, last = q[-1]
            ans = max(ans, last - first + 1)

            for _ in range(level_size):
                node, idx = q.popleft()
                idx -= first

                if node.left:
                    q.append((node.left, 2 * idx + 1))
                if node.right:
                    q.append((node.right, 2 * idx + 2))

        return ans`,
  },
  "level-order-traversal": {
    slug: "level-order-traversal",
    title: "Level Order Traversal",
    intuition:
      "Classic BFS. Process nodes level by level using queue length.",
    pythonCode: `from collections import deque

class Solution:
    def levelOrder(self, root):
        if not root:
            return []

        ans = []
        q = deque([root])

        while q:
            level_size = len(q)
            level = []

            for _ in range(level_size):
                node = q.popleft()
                level.append(node.data)

                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)

            ans.append(level)

        return ans`,
  },
  "height-of-a-binary-tree": {
    slug: "height-of-a-binary-tree",
    title: "Height of a Binary Tree",
    intuition:
      "Recursively compute max height of left and right subtree plus one.",
    pythonCode: `class Solution:
    def maxDepth(self, root):
        if not root:
            return 0

        left_height = self.maxDepth(root.left)
        right_height = self.maxDepth(root.right)

        return 1 + max(left_height, right_height)`,
  },
};
