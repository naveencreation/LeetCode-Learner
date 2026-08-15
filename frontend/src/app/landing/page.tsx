"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Space_Grotesk, Outfit, JetBrains_Mono } from "next/font/google";
import { Logo } from "@/components/Logo";
import { TortoiseHareVis } from "./components/TortoiseHareVis";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
});



// Scroll Reveal Hook
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".lp-reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// Navbar Component
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 h-[72px] border-b border-transparent transition-all duration-400 ${
        scrolled ? "backdrop-blur-xl bg-[oklch(6%_0.03_280_/_0.92)] border-[var(--l-border)]" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center no-underline group">
          <Logo 
            size={32} 
            variant="horizontal"
            theme="dark"
            className="transition-all duration-300 group-hover:scale-105"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-6 list-none">
          {[
            { label: "How It Works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Compare", href: "#compare" },
            { label: "Problem", href: "#problem" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-sm font-medium text-[var(--l-text-3)] hover:text-[var(--l-text)] no-underline relative transition-colors duration-200 py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--l-primary)] to-[var(--l-accent)] scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 bg-[var(--l-primary)] text-[var(--l-bg)] rounded-full px-4 py-2 text-xs font-semibold"
          >
            Try Free
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Hidden until backend authentication is integrated */}
          {/* <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-transparent text-[var(--l-text-2)] border border-[var(--l-border-2)] rounded-full px-5 py-2.5 font-medium transition-all duration-300 hover:text-[var(--l-text)] hover:border-[var(--l-primary)] hover:bg-[oklch(65%_0.22_280_/_0.1)] hover:shadow-[0_8px_24px_oklch(65%_0.22_280_/_0.15)]"
          >
            Log in
          </Link> */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[var(--l-primary)] text-[var(--l-bg)] rounded-full px-5 py-2.5 font-semibold transition-all duration-300 hover:translate-y-[-3px] hover:scale-[1.02] hover:shadow-[0_16px_48px_oklch(65%_0.22_280_/_0.5),0_0_0_1px_oklch(65%_0.22_280_/_0.3)_inset] hover:bg-[var(--l-primary-bright)]"
          >
            Try Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="min-h-[78vh] flex flex-col items-center justify-center relative overflow-hidden py-16 md:py-24">
      {/* Subtle Background Accent */}
      <div
        className="absolute w-[1000px] h-[800px] top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, oklch(65% 0.22 280 / 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
        <h1 className="lp-reveal mb-6 font-[var(--font-space-grotesk)] text-[clamp(3.5rem,8.5vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.04em] text-[var(--l-text)]">
          Master algorithms through
          <br />
          <span className="text-[var(--l-primary)] font-bold">visual execution.</span>
        </h1>

        <p className="lp-reveal lp-delay-3 text-lg md:text-xl text-[var(--l-text-2)] max-w-[58ch] mx-auto mb-10 leading-relaxed font-[var(--font-outfit)]">
          Step-by-step interactive execution for binary trees, linked lists, and core LeetCode problems. Watch pointers, call stacks, and memory state live.
        </p>

        <div className="lp-reveal lp-delay-4 flex items-center justify-center gap-4 flex-wrap mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[var(--l-primary)] text-[var(--l-bg)] rounded-full text-lg px-7 py-4 font-semibold transition-all duration-300 hover:translate-y-[-3px] hover:scale-[1.02] hover:shadow-[0_16px_48px_oklch(65%_0.22_280_/_0.5),0_0_0_1px_oklch(65%_0.22_280_/_0.3)_inset] hover:bg-[var(--l-primary-bright)] group"
          >
            Start Visualizing — It&apos;s Free
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
          <a
            href="#solution"
            className="inline-flex items-center gap-2 bg-transparent text-[var(--l-text-2)] border border-[var(--l-border-2)] rounded-full px-6 py-4 font-medium transition-all duration-300 hover:text-[var(--l-text)] hover:border-[var(--l-primary)] hover:bg-[oklch(65%_0.22_280_/_0.1)] hover:shadow-[0_8px_24px_oklch(65%_0.22_280_/_0.15)] group"
          >
            See how it works
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-transform duration-300 group-hover:translate-y-1"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>

        <p className="lp-reveal lp-delay-5 font-[var(--font-jetbrains)] text-xs text-[var(--l-ghost)] tracking-wide">
          <span className="text-[var(--l-primary)]">✓</span> No account required &nbsp;&nbsp;
          <span className="text-[var(--l-primary)]">✓</span> No install &nbsp;&nbsp;
          <span className="text-[var(--l-primary)]">✓</span> Runs in browser
        </p>
      </div>
    </section>
  );
}

// Marquee Section
function MarqueeSection() {
  const items = [
    "Two Pointers",
    "Sliding Window",
    "Floyd's Cycle Detection",
    "Binary Search",
    "Tree Traversal",
    "Dynamic Programming",
    "Merge Sort",
    "Graph BFS/DFS",
  ];

  return (
    <div className="border-y border-[var(--l-border)] bg-[var(--l-surface)] py-6 overflow-hidden whitespace-nowrap relative">
      <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-gradient-to-r from-[var(--l-surface)] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-[120px] bg-gradient-to-l from-[var(--l-surface)] to-transparent z-10" />
      <div className="inline-flex animate-[lp-marquee_40s_linear_infinite]">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-7 font-[var(--font-jetbrains)] text-sm text-[var(--l-muted)] tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--l-primary)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Problem Section
function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-28 py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="lp-reveal inline-flex items-center gap-2 font-[var(--font-jetbrains)] text-xs font-semibold tracking-widest uppercase text-[var(--l-primary)]">
            // The Problem
          </span>
          <h2 className="lp-reveal lp-delay-2 mt-4 font-[var(--font-space-grotesk)] text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--l-text)]">
            You&apos;ve watched every video tutorial.
            <br />
            <span className="text-[var(--l-primary)]">You still can&apos;t write it.</span>
          </h2>
          <p className="lp-reveal lp-delay-3 text-lg text-[var(--l-text-2)] leading-relaxed max-w-[58ch] mx-auto mt-4 font-[var(--font-outfit)]">
            That&apos;s not a knowledge problem. That&apos;s a visualization problem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              tag: "01 / PASSIVE LEARNING",
              title: "The Passive Trap",
              desc: "You watch a 12-minute video, nod along, feel confident — then open a blank file and realize you can't reproduce a single step without rewatching.",
            },
            {
              tag: "02 / BLACK BOX OUTPUT",
              title: "The Silent Failure",
              desc: 'LeetCode says "Output: Wrong". It doesn\'t show which pointer moved to the wrong node at step 3 or where state mutated incorrectly.',
            },
            {
              tag: "03 / MENTAL LOAD",
              title: "The Loop Confusion",
              desc: "You understand the algorithm conceptually, but when 2+ pointers move simultaneously, you lose track of which variable holds what.",
            },
          ].map((card, i) => (
            <article
              key={i}
              className={`lp-reveal lp-delay-${i + 1} relative bg-[var(--l-surface)] border border-[var(--l-border)] rounded-2xl p-8 transition-all duration-300 hover:border-[var(--l-border-2)] hover:bg-[var(--l-surface-2)] flex flex-col justify-between`}
            >
              <div>
                <span className="font-[var(--font-jetbrains)] text-xs text-[var(--l-primary)] font-semibold tracking-wider block mb-6">
                  {card.tag}
                </span>
                <h3 className="font-[var(--font-space-grotesk)] text-xl font-bold text-[var(--l-text)] mb-3">
                  {card.title}
                </h3>
                <p className="text-[var(--l-text-2)] leading-relaxed text-sm font-[var(--font-outfit)]">
                  {card.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Solution Section
function SolutionSection() {
  return (
    <section id="solution" className="scroll-mt-28 py-24 md:py-32 bg-[var(--l-bg-2)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="lp-reveal inline-flex items-center gap-3 font-[var(--font-outfit)] text-xs font-semibold tracking-[0.2em] uppercase text-[var(--l-primary)]">
            <span className="w-6 h-0.5 bg-gradient-to-r from-[var(--l-primary)] to-transparent" />
            The Solution
          </span>
          <h2 className="lp-reveal lp-delay-2 mt-5 font-[var(--font-space-grotesk)] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--l-text)]">
            See the execution.
            <br />
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, var(--l-text) 0%, var(--l-primary) 50%, var(--l-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Build the intuition.
            </span>
          </h2>
          <p className="lp-reveal lp-delay-3 text-lg text-[var(--l-text-2)] leading-relaxed max-w-[60ch] mx-auto mt-5">
            Every variable, every pointer, every step — visualized in real time.
          </p>
        </div>

        <div className="lp-reveal">
          <TortoiseHareVis />
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-28 py-24 md:py-32 bg-[var(--l-bg)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="lp-reveal inline-flex items-center gap-3 font-[var(--font-outfit)] text-xs font-semibold tracking-[0.2em] uppercase text-[var(--l-primary)]">
            <span className="w-6 h-0.5 bg-gradient-to-r from-[var(--l-primary)] to-transparent" />
            Capabilities
          </span>
          <h2 className="lp-reveal lp-delay-2 mt-5 font-[var(--font-space-grotesk)] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--l-text)]">
            Everything you need to{" "}
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, var(--l-primary) 0%, var(--l-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              truly understand
            </span>
            <br />
            algorithms
          </h2>
        </div>

        {/* Bento top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Big card 1: Pointer-Aware Visualizer */}
          <article className="lp-reveal lp-delay-1 relative bg-[var(--l-surface)] border border-[var(--l-border)] rounded-2xl p-8 transition-all duration-400 hover:border-[oklch(65%_0.22_280_/_0.5)] hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.1em] px-3 py-1 rounded-full mb-4 bg-[oklch(65%_0.22_280_/_0.12)] border border-[oklch(65%_0.22_280_/_0.28)] text-[var(--l-primary)]">
              Core
            </span>
            <h3 className="font-[var(--font-space-grotesk)] font-bold text-[1.1875rem] text-[var(--l-text)] mb-3">
              Pointer-Aware Visualizer
            </h3>
            <p className="text-[0.9375rem] text-[var(--l-muted)] leading-[1.72] mb-6">
              Fast and slow pointers rendered in real-time. As each step executes, both pointers reposition with animated transitions, so you see the race unfold rather than guessing.
            </p>
            {/* Phase bar */}
            <div className="flex gap-2 mt-2">
              {["Init", "Step", "Cond", "Exit"].map((label, i) => (
                <div key={label} className="flex-1">
                  <div
                    className={`w-2 h-2 rounded-full mb-1 transition-colors duration-200 ${
                      i < 3 ? "bg-[var(--l-primary)] shadow-[0_0_8px_var(--l-primary)]" : "bg-[var(--l-border)]"
                    }`}
                  />
                  <div
                    className={`h-[3px] rounded-sm transition-colors duration-200 ${
                      i < 3 ? "bg-[var(--l-primary)]" : "bg-[var(--l-border)]"
                    }`}
                  />
                  <div
                    className={`font-[var(--font-jetbrains)] text-[10px] uppercase tracking-[0.06em] mt-1 ${
                      i < 3 ? "text-[var(--l-primary)]" : "text-[var(--l-ghost)]"
                    }`}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Big card 2: Condition Evaluator */}
          <article className="lp-reveal lp-delay-2 relative bg-[var(--l-surface)] border border-[var(--l-border)] rounded-2xl p-8 transition-all duration-400 hover:border-[oklch(65%_0.22_280_/_0.5)] hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.1em] px-3 py-1 rounded-full mb-4 bg-[oklch(73%_0.15_280_/_0.12)] border border-[oklch(73%_0.15_280_/_0.28)] text-[var(--l-accent)]">
              Unique
            </span>
            <h3 className="font-[var(--font-space-grotesk)] font-bold text-[1.1875rem] text-[var(--l-text)] mb-3">
              Condition Evaluator
            </h3>
            <p className="text-[0.9375rem] text-[var(--l-muted)] leading-[1.72] mb-6">
              Every loop guard and conditional is dissected at each step — TRUE / FALSE chips show the evaluated state of each sub-expression so you never have to guess why a branch is taken.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="font-[var(--font-jetbrains)] text-[11px] px-3 py-1.5 rounded-md bg-[oklch(88%_0.2_155_/_0.1)] border border-[oklch(88%_0.2_155_/_0.3)] text-[var(--l-success)]">
                fast ≠ null · TRUE
              </span>
              <span className="font-[var(--font-jetbrains)] text-[11px] px-3 py-1.5 rounded-md bg-[oklch(68%_0.19_22_/_0.1)] border border-[oklch(68%_0.19_22_/_0.3)] text-[var(--l-error)]">
                fast.next ≠ null · FALSE
              </span>
              <span className="font-[var(--font-jetbrains)] text-[11px] px-3 py-1.5 rounded-md bg-[oklch(85%_0.17_75_/_0.1)] border border-[oklch(85%_0.17_75_/_0.3)] text-[var(--l-warning)]">
                → EXIT LOOP
              </span>
            </div>
          </article>
        </div>

        {/* Bento bottom row: 3 small cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              title: "60+ Curated Problems",
              body: "Arrays, trees, graphs, heaps, DP — every pattern you'll meet in a FAANG loop, pre-loaded.",
              icon: (
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
            {
              title: "Speed Control",
              body: "Replay at 0.25× to internalize nuance, or scrub to any step and jump backwards — total execution control.",
              icon: (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </>
              ),
            },
            {
              title: "Annotate & Export",
              body: "Add notes to any step. Export annotated walkthroughs to share with peers or revisit later.",
              icon: (
                <path
                  d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
          ].map((card, i) => (
            <article
              key={i}
              className={`lp-reveal lp-delay-${i + 1} bg-[var(--l-surface)] border border-[var(--l-border)] rounded-2xl p-7 transition-all duration-400 hover:border-[oklch(65%_0.22_280_/_0.4)] hover:translate-y-[-5px] hover:shadow-[0_20px_48px_rgba(0,0,0,0.3)]`}
            >
              <div className="text-[var(--l-primary)] mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  {card.icon}
                </svg>
              </div>
              <h3 className="font-[var(--font-space-grotesk)] font-bold text-[0.9375rem] text-[var(--l-text)] mb-2">
                {card.title}
              </h3>
              <p className="text-[0.875rem] text-[var(--l-muted)] leading-[1.65]">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Pick a pattern",
      body: "Choose from 60+ problems organized by pattern type — two-pointer, BFS, DP memoization, and more.",
    },
    {
      num: "02",
      title: "Step through execution",
      body: "Advance line by line. Watch variable state update, structures transform, and pointers reposition live.",
    },
    {
      num: "03",
      title: "Understand the decisions",
      body: "Each conditional is evaluated openly. Know exactly why the loop continues, why the swap happens.",
    },
    {
      num: "04",
      title: "Write from memory",
      body: "After visualizing, the whiteboard is yours. Write the algorithm from scratch — the mental model is now real.",
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-28 py-24 md:py-32 bg-[var(--l-bg-2)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="lp-reveal inline-flex items-center gap-3 font-[var(--font-outfit)] text-xs font-semibold tracking-[0.2em] uppercase text-[var(--l-primary)]">
            <span className="w-6 h-0.5 bg-gradient-to-r from-[var(--l-primary)] to-transparent" />
            How It Works
          </span>
          <h2 className="lp-reveal lp-delay-2 mt-5 font-[var(--font-space-grotesk)] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--l-text)]">
            From confusion to{" "}
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, var(--l-primary) 0%, var(--l-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              confident recall
            </span>
            {" "}in 4 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {/* Connecting line on desktop */}
          <div
            className="hidden lg:block absolute top-[44px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--l-border), var(--l-border), var(--l-border), transparent)",
            }}
          />

          {steps.map((step, i) => (
            <article
              key={i}
              className={`lp-reveal lp-delay-${i + 1} group bg-[var(--l-surface)] border border-[var(--l-border)] rounded-2xl p-8 text-center transition-all duration-400 hover:border-[oklch(65%_0.22_280_/_0.5)] hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]`}
            >
              <div className="w-14 h-14 rounded-full bg-[var(--l-surface)] border border-[var(--l-border)] flex items-center justify-center font-[var(--font-space-grotesk)] font-bold text-base text-[var(--l-primary)] mx-auto mb-6 relative z-10 transition-all duration-400 group-hover:bg-[oklch(65%_0.22_280_/_0.12)] group-hover:border-[oklch(65%_0.22_280_/_0.5)] group-hover:shadow-[0_0_24px_oklch(65%_0.22_280_/_0.2)]">
                {step.num}
              </div>
              <h3 className="font-[var(--font-space-grotesk)] font-bold text-[1.0625rem] text-[var(--l-text)] mb-3">
                {step.title}
              </h3>
              <p className="text-[0.9rem] text-[var(--l-muted)] leading-[1.7]">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Compare Section
function CompareSection() {
  const rows = [
    { feature: "Step-through execution", video: "✗ None", thinkdsa: "✓ Full control", leetcode: "✗ None" },
    { feature: "Visual pointer tracking", video: "~ Static diagrams", thinkdsa: "✓ Live, animated", leetcode: "✗ None" },
    { feature: "Condition evaluation", video: "✗ None", thinkdsa: "✓ Per-step values", leetcode: "✗ None" },
    { feature: "Go backwards through code", video: "~ Scrub video", thinkdsa: "✓ Any step", leetcode: "✗ None" },
    { feature: "Tests correctness", video: "✗ No", thinkdsa: "✗ Not the goal", leetcode: "✓ Yes" },
    { feature: "Explains wrong output", video: "✗ No", thinkdsa: "✓ Shows exactly why", leetcode: "✗ Just 'Wrong Answer'" },
  ];

  return (
    <section id="compare" className="scroll-mt-28 py-24 md:py-32 bg-[var(--l-bg-2)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="lp-reveal inline-flex items-center gap-3 font-[var(--font-outfit)] text-xs font-semibold tracking-[0.2em] uppercase text-[var(--l-primary)]">
            <span className="w-6 h-0.5 bg-gradient-to-r from-[var(--l-primary)] to-transparent" />
            Comparison
          </span>
          <h2 className="lp-reveal lp-delay-2 mt-5 font-[var(--font-space-grotesk)] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--l-text)]">
            Not a replacement.
            <br />
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, var(--l-text) 0%, var(--l-primary) 50%, var(--l-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              A foundation.
            </span>
          </h2>
          <p className="lp-reveal lp-delay-3 text-lg text-[var(--l-text-2)] leading-relaxed max-w-[60ch] mx-auto mt-5">
            LeetCode tests correctness. Videos explain concepts. ThinkDSA shows you the execution — step by step, pointer by pointer.
          </p>
        </div>

        <div className="lp-reveal border border-[var(--l-border)] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--l-bg)]">
                <th className="p-6 text-left text-xs font-semibold tracking-widest uppercase text-[var(--l-muted)] border-b border-[var(--l-border)]" />
                <th className="p-6 text-left text-xs font-semibold tracking-widest uppercase text-[var(--l-muted)] border-b border-[var(--l-border)]">YouTube / Videos</th>
                <th className="p-6 text-left text-xs font-bold tracking-widest uppercase text-[var(--l-primary)] border-b border-[var(--l-border)] bg-[oklch(65%_0.22_280_/_0.08)] border-x border-[oklch(65%_0.22_280_/_0.2)]">
                  ThinkDSA
                </th>
                <th className="p-6 text-left text-xs font-semibold tracking-widest uppercase text-[var(--l-muted)] border-b border-[var(--l-border)]">LeetCode</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-[var(--l-surface)]" : ""}>
                  <td className="p-4 px-6 font-medium text-[var(--l-text)] border-b border-[var(--l-border)]">{row.feature}</td>
                  <td className="p-4 px-6 text-[var(--l-ghost)] border-b border-[var(--l-border)]">{row.video}</td>
                  <td className="p-4 px-6 text-[var(--l-success)] font-semibold border-b border-[var(--l-border)] bg-[oklch(65%_0.22_280_/_0.05)] border-x border-[oklch(65%_0.22_280_/_0.15)]">
                    {row.thinkdsa}
                  </td>
                  <td className="p-4 px-6 text-[var(--l-ghost)] border-b border-[var(--l-border)]">{row.leetcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-32 bg-[var(--l-surface)] relative overflow-hidden">
      <div
        className="absolute w-[800px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-[lp-glow-pulse_8s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(ellipse, oklch(65% 0.22 280 / 0.2) 0%, transparent 60%)" }}
      />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center">
          <h2 className="lp-reveal font-[var(--font-space-grotesk)] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--l-text)] mb-6">
            Stop memorizing.
            <br />
            Start{" "}
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, var(--l-text) 0%, var(--l-primary) 50%, var(--l-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              understanding.
            </span>
          </h2>
          <p className="lp-reveal lp-delay-2 text-lg text-[var(--l-text-2)] leading-relaxed max-w-[500px] mx-auto mb-8">
            The algorithm makes sense when you can see it. Open the sandbox — no sign-up, no install, right now.
          </p>
          <div className="lp-reveal lp-delay-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[var(--l-primary)] text-[var(--l-bg)] text-lg px-8 py-6 rounded-full font-semibold transition-all duration-300 hover:translate-y-[-3px] hover:scale-[1.02] hover:shadow-[0_20px_60px_oklch(65%_0.22_280_/_0.4)] hover:bg-[var(--l-primary-bright)] group"
            >
              Open the Free Sandbox
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          <p className="lp-reveal lp-delay-4 font-[var(--font-jetbrains)] text-xs text-[var(--l-ghost)] mt-6 tracking-wide">
            No account required · Core sandbox always free · Runs in any browser
          </p>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-[var(--l-border)] bg-[var(--l-bg)] py-16 text-sm">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center no-underline mb-4">
              <Logo size={24} variant="horizontal" theme="dark" />
            </Link>
            <p className="text-sm text-[var(--l-text-2)] leading-relaxed max-w-[280px] font-[var(--font-outfit)]">
              Visual execution engine for developers who want to actually master data structures and algorithms.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="font-[var(--font-jetbrains)] text-xs font-bold tracking-widest uppercase text-[var(--l-text)] mb-4">
              Navigation
            </div>
            <ul className="list-none flex flex-col gap-2.5 p-0 m-0">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "Compare", href: "#compare" },
                { label: "Problem", href: "#problem" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-[var(--l-text-2)] hover:text-[var(--l-text)] no-underline transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <div className="font-[var(--font-jetbrains)] text-xs font-bold tracking-widest uppercase text-[var(--l-text)] mb-4">
              DSA Topics
            </div>
            <ul className="list-none flex flex-col gap-2.5 p-0 m-0">
              {[
                { label: "Binary Trees", href: "/problems" },
                { label: "Linked Lists", href: "/problems" },
                { label: "Two Pointers", href: "/problems" },
                { label: "Recursion & Backtracking", href: "/problems" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--l-text-2)] hover:text-[var(--l-text)] no-underline transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="font-[var(--font-jetbrains)] text-xs font-bold tracking-widest uppercase text-[var(--l-text)] mb-4">
              Connect
            </div>
            <ul className="list-none flex flex-col gap-2.5 p-0 m-0">
              {[
                {
                  name: "GitHub Profile",
                  href: "https://github.com/naveencreation",
                  icon: (
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  ),
                },
                {
                  name: "About Creator",
                  href: "https://naveenselvan.me/",
                  icon: (
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  ),
                },
                {
                  name: "Contact Email",
                  href: "mailto:naveenselvan0004@gmail.com",
                  icon: (
                    <>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </>
                  ),
                },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-[var(--l-text-2)] hover:text-[var(--l-text)] no-underline flex items-center gap-2.5 transition-colors duration-200"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--l-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--l-text-2)] font-[var(--font-outfit)]">
          <span>© 2026 ThinkDSA. All rights reserved.</span>
          <span>
            Built for developers who ask <span className="text-[var(--l-primary)] font-semibold">why</span>, not just if it works.
          </span>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function LandingPage() {
  useScrollReveal();

  return (
    <div
      className={`${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable} landing-theme bg-[var(--l-bg)] text-[var(--l-text)] min-h-screen`}
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CompareSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
