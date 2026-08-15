"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Braces,
  Link2,
  Quote,
  Layers,
  GitBranch,
  Network,
  Binary,
  Repeat,
  Puzzle,
  ArrowUpDown,
  Settings,
  User,
  Play,
  BookOpen,
  Sun,
  Moon,
  Laptop,
  Check,
  Zap,
  Sliders,
  Volume2,
  CheckCircle2,
  Search,
  X,
  Filter,
  ExternalLink,
} from "lucide-react";
import { sections, getProblemHref, getGuideHref, getPlatformLink, getProblemDifficulty } from "@/data/problems-data";
import { LeetCodeIcon, GFGIcon } from "@/components/dsa-icons";
import { useTheme } from "@/components/theme-provider";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Logo } from "@/components/Logo";

export interface ProblemItem {
  title: string;
  sectionName: string;
  difficulty: "Easy" | "Medium" | "Hard";
  href: string | null;
}

export interface TopicGroup {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: React.ElementType;
  route: string;
  problems: ProblemItem[];
}

const TOPIC_DEFINITIONS: { id: string; key: string; name: string; description: string; icon: React.ElementType; route: string; matches: (s: string) => boolean }[] = [
  {
    id: "array",
    key: "arrays",
    name: "Array",
    description: "Arrays, 2D matrices, two pointers & prefix sums",
    icon: Braces,
    route: "/problems/topics/arrays",
    matches: (s) => s.startsWith("Arrays"),
  },
  {
    id: "list",
    key: "linked-list",
    name: "Linked List",
    description: "Singly & doubly lists, fast/slow pointers & cycle detection",
    icon: Link2,
    route: "/problems/topics/linked-list",
    matches: (s) => s.startsWith("Linked List"),
  },
  {
    id: "string",
    key: "strings",
    name: "String",
    description: "String manipulation, pattern matching & anagrams",
    icon: Quote,
    route: "/problems/topics/strings",
    matches: (s) => s.startsWith("String"),
  },
  {
    id: "stack-queue",
    key: "stack-queue",
    name: "Stack & Queue",
    description: "LIFO & FIFO structures, monotonic stacks & sliding windows",
    icon: Layers,
    route: "/problems/topics/stack-queue",
    matches: (s) => s.startsWith("Stack"),
  },
  {
    id: "tree",
    key: "trees",
    name: "Tree",
    description: "Binary trees, BSTs, traversals & common patterns",
    icon: GitBranch,
    route: "/problems/topics/trees",
    matches: (s) => s.includes("Tree") || s.includes("BST"),
  },
  {
    id: "graph",
    key: "graph",
    name: "Graph",
    description: "BFS, DFS, shortest paths, DAGs & topological sort",
    icon: Network,
    route: "/problems/topics/graph",
    matches: (s) => s.startsWith("Graph"),
  },
  {
    id: "dp",
    key: "dp",
    name: "Dynamic Programming",
    description: "Memoization, tabulation, knapsack & sub-problems",
    icon: Binary,
    route: "/problems/topics/dp",
    matches: (s) => s.startsWith("Dynamic Programming") || s.startsWith("DP"),
  },
  {
    id: "greedy",
    key: "greedy",
    name: "Greedy",
    description: "Local optimal choices, interval scheduling & activity selection",
    icon: Puzzle,
    route: "/problems/topics/greedy",
    matches: (s) => s.startsWith("Greedy"),
  },
  {
    id: "sorting",
    key: "sorting",
    name: "Sorting & Searching",
    description: "Binary search, merge sort, quicksort & heaps",
    icon: ArrowUpDown,
    route: "/problems/topics/sorting",
    matches: (s) => s.includes("Search") || s.includes("Sort") || s.includes("Heaps"),
  },
  {
    id: "recursion",
    key: "recursion",
    name: "Recursion & Backtracking",
    description: "Subsets, combinations, permutations & N-Queens",
    icon: Repeat,
    route: "/problems/topics/recursion",
    matches: (s) => s.startsWith("Recursion"),
  },
];

interface DSASidebarProps {
  initialTopicId?: string;
}

const KEY_MAP: Record<string, string> = {
  arrays: "array",
  "linked-list": "list",
  trees: "tree",
  bst: "tree",
  graph: "graph",
  dp: "dp",
  recursion: "recursion",
  strings: "string",
  string: "string",
};

export default function DSASidebar({ initialTopicId }: DSASidebarProps = {}) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [playbackSpeed, setPlaybackSpeed] = useState<string>("1.0x");
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [soundEffects, setSoundEffects] = useState<boolean>(false);

  // Search & Difficulty Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const topics: TopicGroup[] = useMemo(() => {
    return TOPIC_DEFINITIONS.map((def) => {
      const matchedSections = sections.filter((sec) => def.matches(sec.name));
      const problems: ProblemItem[] = matchedSections.flatMap((sec) =>
        sec.problems.map((p) => ({
          title: p,
          sectionName: sec.name,
          difficulty: getProblemDifficulty(p),
          href: getProblemHref(sec.name, p),
        }))
      );
      return {
        id: def.id,
        key: def.key,
        name: def.name,
        description: def.description,
        icon: def.icon,
        route: def.route,
        problems,
      };
    });
  }, []);

  // Determine active view based on URL pathname first, falling back to initialTopicId
  const activeView = useMemo(() => {
    if (pathname.includes("/settings")) return "settings";
    if (pathname.includes("/profile")) return "profile";

    for (const topic of topics) {
      if (pathname.includes(topic.key) || pathname.includes(topic.id)) {
        return topic.id;
      }
    }

    if (initialTopicId) {
      return KEY_MAP[initialTopicId] || initialTopicId;
    }

    return "array";
  }, [pathname, initialTopicId, topics]);

  const activeTopic = topics.find((t) => t.id === activeView);
  const isSettingsActive = activeView === "settings";
  const isProfileActive = activeView === "profile";

  const filteredProblems = useMemo(() => {
    if (!activeTopic) return [];
    return activeTopic.problems.filter((problem) => {
      if (difficultyFilter === "Easy" && problem.difficulty !== "Easy") return false;
      if (difficultyFilter === "Medium" && problem.difficulty !== "Medium") return false;
      if (difficultyFilter === "Hard" && problem.difficulty !== "Hard") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = problem.title.toLowerCase().includes(q);
        const matchSection = problem.sectionName.toLowerCase().includes(q);
        return matchTitle || matchSection;
      }

      return true;
    });
  }, [activeTopic, difficultyFilter, searchQuery]);

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r select-none border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 transition-colors duration-200">
        <Link href="/problems/topics/trees" className="flex items-center border-b px-5 py-3.5 border-slate-200 dark:border-zinc-800 hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
          <Logo variant="horizontal" size={26} />
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4 ui-scrollbar">
          <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
            Topics
          </p>
          <ul className="space-y-1">
            {topics.map((topic) => {
              const Icon = topic.icon;
              const isActive = topic.id === activeView;
              return (
                <li key={topic.id}>
                  <Link
                    href={topic.route}
                    title={topic.name}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-800 font-bold border-l-2 border-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-300 dark:font-medium"
                        : "text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-600 group-hover:text-slate-900 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                      }`}
                    />
                    <span className="flex-1 truncate">{topic.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Actions: Settings & Profile */}
        <div className="border-t px-3 py-3 space-y-0.5 border-slate-200 dark:border-zinc-800">
          <Link
            href="/settings"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all ${
              isSettingsActive
                ? "bg-indigo-50 text-indigo-800 font-bold border-l-2 border-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-300 dark:font-medium"
                : "text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
            }`}
          >
            <Settings
              className={`h-4 w-4 ${
                isSettingsActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-zinc-400"
              }`}
            />
            Settings
          </Link>
          <Link
            href="/profile"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all ${
              isProfileActive
                ? "bg-indigo-50 text-indigo-800 font-bold border-l-2 border-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-300 dark:font-medium"
                : "text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
            }`}
          >
            <User
              className={`h-4 w-4 ${
                isProfileActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-zinc-400"
              }`}
            />
            Profile
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-200">
        {/* ── SETTINGS VIEW ── */}
        {isSettingsActive ? (
          <div className="flex-1 overflow-y-auto px-8 py-6 ui-scrollbar">
            <div className="max-w-4xl space-y-8">
            <div>
              <div className="flex items-center gap-2.5">
                <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  Settings & Preferences
                </h1>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                Manage theme modes, visualizer behavior, and system options.
              </p>
            </div>

            {/* Theme Mode Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">
                    Appearance & Theme
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Select your preferred interface color mode.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Dark Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`relative flex flex-col justify-between rounded-xl border p-5 text-left transition-all ${
                    theme === "dark"
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-indigo-400 border border-zinc-700">
                        <Moon className="h-5 w-5" />
                      </div>
                      {theme === "dark" && (
                        <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                          <Check className="h-3 w-3" /> Active
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                      Dark Mode
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                      Sleek dark zinc layout with vibrant indigo and emerald accents.
                    </p>
                  </div>
                  <div className="mt-4 flex h-6 w-full items-center justify-around rounded-md bg-zinc-950 border border-zinc-800 px-2">
                    <div className="h-2 w-12 rounded bg-zinc-800" />
                    <div className="h-2 w-6 rounded bg-indigo-500" />
                  </div>
                </button>

                {/* Light Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`relative flex flex-col justify-between rounded-xl border p-5 text-left transition-all ${
                    theme === "light"
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                        <Sun className="h-5 w-5" />
                      </div>
                      {theme === "light" && (
                        <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                          <Check className="h-3 w-3" /> Active
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                      Light Mode
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                      Clean white and slate theme with high contrast readability.
                    </p>
                  </div>
                  <div className="mt-4 flex h-6 w-full items-center justify-around rounded-md bg-slate-100 border border-slate-200 px-2">
                    <div className="h-2 w-12 rounded bg-slate-300" />
                    <div className="h-2 w-6 rounded bg-indigo-600" />
                  </div>
                </button>

                {/* System Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`relative flex flex-col justify-between rounded-xl border p-5 text-left transition-all ${
                    theme === "system"
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        <Laptop className="h-5 w-5" />
                      </div>
                      {theme === "system" && (
                        <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                          <Check className="h-3 w-3" /> Active ({resolvedTheme})
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                      System Default
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                      Sync automatically with your operating system preferences.
                    </p>
                  </div>
                  <div className="mt-4 flex h-6 w-full items-center justify-around rounded-md bg-gradient-to-r from-slate-200 to-zinc-900 border border-zinc-700 px-2">
                    <div className="h-2 w-12 rounded bg-slate-400" />
                    <div className="h-2 w-6 rounded bg-indigo-400" />
                  </div>
                </button>
              </div>
            </div>

            {/* Visualizer Preferences */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">
                    Visualizer & Player Controls
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Configure default animation speed and step playback behavior.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border p-5 space-y-5 border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30">
                {/* Speed selector */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-zinc-200">
                        Default Animation Speed
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Controls step transition speed in visualizer.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border p-1 border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900">
                    {["0.5x", "1.0x", "1.5x", "2.0x"].map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                          playbackSpeed === speed
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                        }`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100 dark:bg-zinc-800" />

                {/* Auto Play toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-zinc-200">
                        Auto-Play Algorithm Steps
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Start playback automatically upon opening a visualizer.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      autoPlay ? "bg-indigo-600" : "bg-slate-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        autoPlay ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="h-px w-full bg-slate-100 dark:bg-zinc-800" />

                {/* Sound effects toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-zinc-200">
                        Sound Cues & Audio
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Play subtle audio effects when algorithm state updates.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundEffects(!soundEffects)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      soundEffects ? "bg-indigo-600" : "bg-slate-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        soundEffects ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        ) : isProfileActive ? (
          /* ── PROFILE VIEW ── */
          <div className="flex-1 overflow-y-auto px-8 py-6 ui-scrollbar">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg">
                  U
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                    DSA Student Profile
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    LeetCode-Learner Member
                  </p>
                </div>
              </div>

              <div className="rounded-xl border p-6 space-y-4 border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30">
                <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100">
                  Account Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs text-slate-400 dark:text-zinc-500">Status</span>
                    <span className="font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" /> Active Learner
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 dark:text-zinc-500">Active Theme</span>
                    <span className="font-semibold capitalize mt-0.5 text-slate-800 dark:text-zinc-200">
                      {theme} ({resolvedTheme})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTopic ? (
          /* ── TOPICS TABLE VIEW ── */
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden px-8 pt-6 pb-6">
            {/* Search & Difficulty Filter Toolbar (Fixed Non-Scrolling Header) */}
            <div className="shrink-0 pb-6 bg-slate-50 dark:bg-zinc-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-100">
                    {activeTopic.name}
                  </h1>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-zinc-400">
                    {activeTopic.description}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold border-indigo-100 bg-indigo-50/70 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {filteredProblems.length === activeTopic.problems.length
                        ? `${activeTopic.problems.length} Problems`
                        : `Showing ${filteredProblems.length} of ${activeTopic.problems.length} Problems`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Difficulty Filter Pills */}
                  <div className="flex items-center gap-1 rounded-lg border p-1 border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                    {(["All", "Easy", "Medium", "Hard"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setDifficultyFilter(filter)}
                        className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                          difficultyFilter === filter
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-zinc-100"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search problem..."
                      className="w-full rounded-lg border py-1.5 pl-9 pr-8 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-200 bg-white text-slate-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-500">
                        ⌘K
                      </kbd>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Table Box (Static Header + Independent Scroll Container) */}
            <div className="flex flex-1 flex-col min-h-0 rounded-xl border shadow-sm overflow-hidden border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30">
              {/* Static Table Header (Completely Non-Moving & Gutter-Aligned) */}
              <div className="shrink-0 grid grid-cols-[44px_1fr_120px_240px] items-center border-b px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 [scrollbar-gutter:stable]">
                <div className="font-mono text-slate-400 dark:text-zinc-500">#</div>
                <div>Problem</div>
                <div className="text-center">Difficulty</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Independently Scrollable Problem Rows Container */}
              <div className="flex-1 overflow-y-auto min-h-0 ui-scrollbar [scrollbar-gutter:stable]">
                {/* Empty state when filtering yields no results */}
                {filteredProblems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Filter className="h-8 w-8 text-slate-400 dark:text-zinc-600 mb-3" />
                  <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-200">
                    No problems found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs">
                    No problems match your search filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setDifficultyFilter("All");
                    }}
                    className="mt-4 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                /* Table Body */
                filteredProblems.map((problem, i) => {
                  const hasVisualizer = Boolean(problem.href);
                  const guideHref = getGuideHref(problem.title);
                  const platform = getPlatformLink(problem.title);

                  return (
                    <div
                      key={`${problem.sectionName}-${problem.title}`}
                      className={`grid grid-cols-[44px_1fr_120px_240px] items-center px-5 py-3.5 text-sm transition-colors ${
                        i !== filteredProblems.length - 1
                          ? "border-b border-slate-200/80 dark:border-zinc-800/80"
                          : ""
                      } hover:bg-slate-100/70 dark:hover:bg-zinc-900/70`}
                    >
                      {/* Col 1: Index Number */}
                      <span className="tabular-nums font-mono text-xs font-normal text-slate-400 dark:text-zinc-500">
                        {String(i + 1).padStart(2, "0")}.
                      </span>

                      {/* Col 2: Problem Title */}
                      <div className="min-w-0 pr-4">
                        <span className="truncate font-semibold text-slate-900 dark:text-zinc-100 block">
                          {problem.title}
                        </span>
                      </div>

                      {/* Col 2: Difficulty (Centered) */}
                      <div className="flex justify-center items-center">
                        <span
                          className={`inline-flex w-[72px] items-center justify-center rounded-full border py-0.5 text-[11px] font-bold ${
                            problem.difficulty === "Easy"
                              ? "text-[#047857] bg-[#D0FAE5] border-[#A7F3D0] dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                              : problem.difficulty === "Hard"
                              ? "text-[#B91C1C] bg-[#FEE2E2] border-[#FCA5A5] dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20"
                              : "text-[#B45309] bg-[#FEF3C7] border-[#FDE68A] dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Col 3: Actions (Right Corner) */}
                      <div className="flex items-center justify-end gap-2">
                        {/* Visualize Button */}
                        {hasVisualizer && (
                          <Link
                            href={problem.href!}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition"
                          >
                            <Play className="h-3 w-3 fill-white text-white" />
                            <span>Visualize</span>
                          </Link>
                        )}

                        {/* Learn Button Icon */}
                        {guideHref && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Link
                                  href={guideHref}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition"
                                />
                              }
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Read Learning Guide</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* External Platform Link (LeetCode / GFG) */}
                        {platform && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <a
                                  href={platform.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group inline-flex h-8 items-center gap-1 rounded-lg border px-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition"
                                />
                              }
                            >
                              {platform.platform === "leetcode" ? (
                                <LeetCodeIcon size={14} />
                              ) : (
                                <GFGIcon size={14} />
                              )}
                              <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{platform.platform === "leetcode" ? "Open in LeetCode ↗" : "Open in GeeksforGeeks ↗"}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
