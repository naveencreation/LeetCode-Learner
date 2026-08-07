# 🚀 LeetCode Learner

> **An Interactive Data Structures & Algorithms Visualizer for Deep Conceptual Mastery**

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🎯 Goal & Vision of the Project

Understanding Data Structures and Algorithms (DSA) from text explanations or static code snippets can often feel abstract and overwhelming. 

**LeetCode Learner** was built to solve this exact problem. The goal of this project is to create an **interactive, step-by-step algorithm visualizer and learning platform** that bridges the gap between Python code logic and mental models.

Instead of just showing the final result, **LeetCode Learner** breaks down every execution step into a synchronized 4-panel visualizer:
1. **Interactive Code Panel**: Highlights the exact line of code currently executing in Python.
2. **Visual Canvas**: Displays the dynamic state of data structures (Trees, Linked Lists) with color-coded node states and directional movement animations.
3. **Live Call Stack & State Tracker**: Visualizes the active recursion call stack, current node variables, and intermediate results.
4. **Pedagogical Step Explanations**: Provides human-readable, contextual explanations for *why* a line is running, *what* state transformed, and *what* the algorithm will do next.

---

## ✨ Key Features

- ⚡ **Synchronized Multi-Panel Execution**: Code highlight, visual canvas, recursion call stack, and step-by-step explanations update synchronously in lockstep.
- 🎮 **Playback Controls**: Step forward, step backward, auto-play with customizable speed (ms), reset, and keyboard shortcuts (`Right Arrow` for Next, `Left Arrow` for Prev, `Space` for Pause/Play).
- 🎨 **Visual Node State Lifecycle**: Color-coded visual badges representing exact node states:
  - ⬜ **Unvisited**: Node not yet reached.
  - 🟠 **Entering Frame**: Call stack frame created for the node.
  - 🔵 **Exploring Left**: Recursively processing left subtree/child.
  - 🟡 **Processing / Recording**: Operating on current node value.
  - 🟣 **Exploring Right**: Recursively processing right subtree/child.
  - 🟢 **Completed**: Subtree/Node processing finished and popped from stack.
- 🌲 **Tree Customization**: Switch between presets (Complete, Skewed Left, Skewed Right, Sparse Random, Custom Empty) or drag and position nodes freely.
- 📱 **Modern Glassmorphic UI**: High-contrast, accessible dark/light panel layout powered by TailwindCSS and Lucide Icons.

---

## 📚 Problem Categories Covered

### 🌳 Binary Trees Suite (20+ Problems & Interactive Guides)
- **Traversals**: Inorder, Preorder, Postorder, Level-Order, Zigzag (Snake) Traversal, All 3 Traversals in Single Pass.
- **Views**: Left View, Right View, Top View, Bottom View, Vertical Order Traversal.
- **Tree Properties & Metrics**: Height / Depth of Tree, Diameter, Balanced Binary Tree Check, Same Tree, Symmetric Tree.
- **Paths & Subtrees**: Root-to-Node Path, Lowest Common Ancestor (LCA), Maximum Width.
- **Tree Transformations & Construction**:
  - Convert BST to Sorted Doubly Linked List
  - Flatten Binary Tree to Linked List
  - Construct Binary Tree from Inorder & Preorder
  - Construct Binary Tree from Inorder & Postorder

### 🔗 Linked Lists Suite (14+ Problems & Interactive Guides)
- **Core Operations**: Reverse Linked List, Middle of Linked List, Delete Node, Rotate Linked List.
- **Cycle & Intersection**: Detect Cycle (Floyd's Tortoise & Hare), Find Cycle Start Node, Intersection Point of Two Lists.
- **Complex Reversals & Modifications**: Reverse Nodes in K-Group, Reorder List, Merge Two Sorted Lists, Add Two Numbers, Palindrome Check, Remove N-th Node From End, Clone List with Random Pointers.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI & Styling**: React 19, TailwindCSS, `@base-ui/react`, Lucide React Icons
- **Language**: TypeScript 5 (Strict Type Compliance)
- **Deployment**: Vercel

---

## 📁 Repository Structure

```
LeetCode-Learner/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router routes & pages
│   │   │   └── (app)/problems/     # Binary Tree & Linked List problem pages
│   │   ├── components/             # Global layout & header components
│   │   └── features/               # Feature modules
│   │       ├── trees/              # Tree execution engine, hooks, & components
│   │       │   ├── inorder/        # Inorder traversal engine & UI
│   │       │   ├── shared/         # Generic traversal hooks, state types
│   │       │   └── ...             # Tree algorithms
│   │       └── linked-list/        # Linked list execution engines & UI
│   ├── public/                     # Static assets & icons
│   ├── package.json                # Dependencies & script definitions
│   └── tsconfig.json               # TypeScript configuration
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `pnpm` / `yarn`

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/naveencreation/LeetCode-Learner.git
   cd LeetCode-Learner/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the visualizer locally.

---

## 📦 Production Build & Testing

To create an optimized production build:

```bash
npm run build
```

To run TypeScript verification:

```bash
npx tsc --noEmit
```

---

## 🌐 Deployment on Vercel

This repository is optimized for one-click deployment on **Vercel**:

1. Import `naveencreation/LeetCode-Learner` into Vercel.
2. Set **Root Directory** to `frontend`.
3. Select **Framework Preset**: `Next.js`.
4. Click **Deploy**!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
