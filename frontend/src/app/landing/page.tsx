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

// Custom Cursor Component
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      requestAnimationFrame(animateRing);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    const animationId = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-[var(--l-primary)] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 mix-blend-screen"
        style={{ left: 0, top: 0 }}
      />
      <div
        ref={ringRef}
        className={`fixed w-10 h-10 border-2 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isHovering ? "w-14 h-14 border-[oklch(65%_0.22_280_/_0.8)]" : "border-[oklch(65%_0.22_280_/_0.4)]"
        }`}
        style={{ left: 0, top: 0 }}
      />
    </>
  );
}

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
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <Logo 
            size={36} 
            color="oklch(65% 0.22 280)"
            className="transition-all duration-300 group-hover:scale-105"
          />
          <span className="font-[var(--font-space-grotesk)] font-semibold text-2xl text-[var(--l-text)] tracking-tight">
            ThinkDSA
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 list-none">
          {["How It Works", "Features", "Compare", "FAQ"].map((item, i) => (
            <li key={item}>
              <a
                href={`#${["solution", "features", "compare", "faq"][i]}`}
                className="text-sm font-medium text-[var(--l-text-3)] no-underline relative transition-colors duration-200 py-2 group"
              >
                {item}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--l-primary)] to-[var(--l-accent)] scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-transparent text-[var(--l-text-2)] border border-[var(--l-border-2)] rounded-full px-5 py-2.5 font-medium transition-all duration-300 hover:text-[var(--l-text)] hover:border-[var(--l-primary)] hover:bg-[oklch(65%_0.22_280_/_0.1)] hover:shadow-[0_8px_24px_oklch(65%_0.22_280_/_0.15)]"
          >
            Log in
          </Link>
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
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-24">
      {/* Background glow */}
      <div
        className="absolute w-[1000px] h-[800px] top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 animate-[lp-glow-pulse_10s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(ellipse, oklch(65% 0.22 280 / 0.15) 0%, transparent 60%)",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-[20%] left-[10%] w-[200px] h-[200px] rounded-full blur-[40px] pointer-events-none animate-[lp-float_8s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, oklch(78% 0.18 195 / 0.2) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[60%] right-[15%] w-[300px] h-[300px] rounded-full blur-[60px] pointer-events-none animate-[lp-float-delayed_10s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, oklch(65% 0.22 280 / 0.15) 0%, transparent 70%)" }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
        <div className="lp-reveal mb-6">
          <span className="inline-flex items-center gap-3 border border-[oklch(65%_0.22_280_/_0.3)] bg-[oklch(65%_0.22_280_/_0.08)] text-[var(--l-primary)] rounded-full px-5 py-3 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--l-primary)] shadow-[0_0_12px_var(--l-primary)] animate-[lp-breathe_2s_ease-in-out_infinite]" />
            Interactive Algorithm Visualization
          </span>
        </div>

        <h1 className="lp-reveal lp-delay-2 mb-6 font-[var(--font-space-grotesk)] text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--l-text)]">
          You&apos;re not bad at
          <br />
          <span className="text-[var(--l-primary)] font-bold">algorithms.</span>
          <br />
          You just can&apos;t see
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
            what they&apos;re doing.
          </span>
        </h1>

        <p className="lp-reveal lp-delay-3 text-lg text-[var(--l-text-2)] leading-relaxed max-w-[60ch] mx-auto mb-8">
          ThinkDSA lets you step through code line-by-line, watch every pointer move in real time, and build the intuition that actually gets you through technical interviews.
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
    <section id="problem" className="py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="lp-reveal inline-flex items-center gap-3 font-[var(--font-outfit)] text-xs font-semibold tracking-[0.2em] uppercase text-[var(--l-primary)]">
            <span className="w-6 h-0.5 bg-gradient-to-r from-[var(--l-primary)] to-transparent" />
            The Problem
          </span>
          <h2 className="lp-reveal lp-delay-2 mt-5 font-[var(--font-space-grotesk)] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--l-text)]">
            You&apos;ve watched every video.
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
              You still can&apos;t write it.
            </span>
          </h2>
          <p className="lp-reveal lp-delay-3 text-lg text-[var(--l-text-2)] leading-relaxed max-w-[60ch] mx-auto mt-5">
            That&apos;s not a knowledge problem. That&apos;s a visualization problem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "The Passive Trap",
              desc: "You watch a 12-minute video, nod along, feel confident — then open a blank file and realize you can't reproduce a single step without rewatching it.",
              accent: "var(--l-error)",
              glow: "oklch(72% 0.2 25 / 0.3)",
              icon: (
                <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0L20.74 6.5A2 2 0 0 1 22 8.35z M6 6l6-4 6 4 M12 4v16" />
              ),
            },
            {
              num: "02",
              title: "The Silent Failure",
              desc: 'LeetCode says "Output: Wrong". It doesn\'t tell you which pointer moved to the wrong node at step 3.',
              accent: "var(--l-warning)",
              glow: "oklch(85% 0.18 85 / 0.3)",
              icon: (
                <>
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </>
              ),
            },
            {
              num: "03",
              title: "The Loop Confusion",
              desc: 'You understand the algorithm conceptually, but when pointers move simultaneously, you lose track of which variable holds what.',
              accent: "var(--l-primary)",
              glow: "oklch(65% 0.22 280 / 0.3)",
              icon: (
                <>
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </>
              ),
            },
          ].map((card, i) => (
            <article
              key={i}
              className={`lp-reveal lp-delay-${i + 1} relative bg-gradient-to-br from-[var(--l-surface)] to-[var(--l-surface-2)] border border-[var(--l-border)] rounded-2xl p-8 transition-all duration-400 hover:border-[oklch(65%_0.22_280_/_0.6)] hover:translate-y-[-8px] hover:scale-[1.01] hover:shadow-[0_32px_64px_rgba(0,0,0,0.4),0_0_40px_${card.glow},0_0_0_1px_${card.accent}_inset] group`}
              style={{ ["--accent-color" as string]: card.accent, ["--accent-glow" as string]: card.glow }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${card.accent} 0%, ${card.glow} 50%, transparent 100%)` }}
              />
              <div
                className="font-[var(--font-space-grotesk)] text-7xl font-bold leading-none mb-4"
                style={{ color: card.accent.replace("var(--l-", "oklch(").replace(")", "") === "oklch(--l-" ? card.accent : "oklch(65% 0.22 280 / 0.4)", opacity: 0.4 }}
              >
                {card.num}
              </div>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center border mb-4"
                style={{
                  background: `linear-gradient(135deg, ${card.glow.replace(" / 0.3", " / 0.2")} 0%, ${card.glow.replace(" / 0.3", " / 0.05")} 100%)`,
                  borderColor: card.accent.replace("var(--l-", "oklch(").replace(")", " / 0.2)"),
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={card.accent} strokeWidth="1.5" strokeLinecap="round">
                  {card.icon}
                </svg>
              </div>
              <h3 className="font-[var(--font-space-grotesk)] text-xl font-semibold text-[var(--l-text)] mb-3">
                {card.title}
              </h3>
              <p className="text-[var(--l-muted)] leading-relaxed">{card.desc}</p>
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
    <section id="solution" className="py-32 bg-[var(--l-bg-2)]">
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
    <section id="compare" className="py-32 bg-[var(--l-bg-2)]">
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
    <footer className="bg-[var(--l-bg)] border-t border-[var(--l-border)] py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-16 mb-16">
          <div>
            <Link href="/" className="flex items-center gap-3 no-underline mb-4 group">
              <Logo 
                size={36} 
                color="oklch(65% 0.22 280)"
                className="transition-all duration-300 group-hover:scale-105"
              />
              <span className="font-[var(--font-space-grotesk)] font-semibold text-2xl text-[var(--l-text)] tracking-tight">
                ThinkDSA
              </span>
            </Link>
            <p className="text-sm text-[var(--l-ghost)] leading-relaxed max-w-[280px]">
              Visual intuition for developers who want to actually understand algorithms, not just memorize them.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--l-muted)] mb-4">Navigate</div>
            <ul className="list-none flex flex-col gap-3">
              {["How It Works", "Features", "Compare", "FAQ"].map((item, i) => (
                <li key={item}>
                  <a
                    href={`#${["solution", "features", "compare", "faq"][i]}`}
                    className="text-sm text-[var(--l-ghost)] no-underline transition-colors duration-200 hover:text-[var(--l-text)]"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--l-muted)] mb-4">Connect</div>
            <ul className="list-none flex flex-col gap-3">
              {[
                { name: "Twitter / X", icon: <path d="M4 4l11.733 16H20L8.267 4z M4 20l6.768-6.768m2.46-2.46L20 4" /> },
                { name: "GitHub", icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /> },
                { name: "Email", icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className="text-sm text-[var(--l-ghost)] no-underline flex items-center gap-3 transition-colors duration-200 hover:text-[var(--l-text)]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {item.icon}
                    </svg>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--l-border)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--l-ghost)]">
          <span>© 2025 ThinkDSA</span>
          <span>
            Built for the developer who asks <em className="text-[var(--l-primary)] not-italic">why</em>, not just if it works.
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
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <ProblemSection />
        <SolutionSection />
        <CompareSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
