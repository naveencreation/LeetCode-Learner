"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./InteractiveShowcase.module.css";

const slides = [
  {
    number: "01",
    eyebrow: "Code Synchronization",
    title: "Every line of code,\nvisualized live.",
    desc: "Watch call stacks, pointers, and variables update in perfect sync with each executing line. Connect every concept to a concrete, visual state.",
  },
  {
    number: "02",
    eyebrow: "Interactive Sandbox",
    title: "Build any tree.\nTest any edge case.",
    desc: "Don't just watch standard examples. Open the sandbox and construct custom trees and graphs to probe exactly how the algorithm behaves on your input.",
  },
  {
    number: "03",
    eyebrow: "Recursion Engine",
    title: "Recursion made\ntangible.",
    desc: "See precisely how functions pause, stack up, and return. We turn abstract recursion depth into a literal, animated stack you can trace one frame at a time.",
  },
];

export default function InteractiveShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      // rect.top goes from 0 (entering) to -(sectionHeight - viewportH) (exiting)
      const scrolled = -rect.top;
      const total = sectionHeight - viewportH;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setSlideProgress(progress);
      if (progress < 0.33) setActiveSlide(0);
      else if (progress < 0.66) setActiveSlide(1);
      else setActiveSlide(2);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={sectionRef} className={styles.scrollSection}>
      <div className={styles.stickyViewport}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrowPill}>The Platform</span>
          <h2 className={styles.sectionTitle}>See every step, live.</h2>
          <p className={styles.sectionSub}>
            A visualization engine purpose-built for learning, not just demos.
          </p>
        </div>

        {/* Progress indicators */}
        <div className={styles.progressRow}>
          {slides.map((s, i) => (
            <button
              key={i}
              className={`${styles.progressPill} ${activeSlide === i ? styles.progressPillActive : ""}`}
              onClick={() => {
                if (!sectionRef.current) return;
                const rect = sectionRef.current.getBoundingClientRect();
                const sectionHeight = sectionRef.current.offsetHeight;
                const viewportH = window.innerHeight;
                const total = sectionHeight - viewportH;
                const targetProgress = (i + 0.5) / 3;
                const targetScrollY = window.scrollY + rect.top + targetProgress * total;
                window.scrollTo({ top: targetScrollY, behavior: "smooth" });
              }}
              aria-label={`Go to slide ${i + 1}`}
            >
              <span className={styles.progressPillLabel}>{s.eyebrow}</span>
            </button>
          ))}
        </div>

        {/* Slides */}
        <div className={styles.slidesStage}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`${styles.slide} ${activeSlide === i ? styles.slideActive : styles.slideHidden}`}
            >
              {/* Left: Text */}
              <div className={styles.slideText}>
                <span className={styles.slideNumber}>{slide.number}</span>
                <h3 className={styles.slideTitle}>
                  {slide.title.split("\n").map((line, li) => (
                    <span key={li}>{line}<br /></span>
                  ))}
                </h3>
                <p className={styles.slideDesc}>{slide.desc}</p>
              </div>

              {/* Right: Visual */}
              <div className={styles.slideVisual}>
                {i === 0 && <Slide1Visual active={activeSlide === 0} />}
                {i === 1 && <Slide2Visual active={activeSlide === 1} />}
                {i === 2 && <Slide3Visual active={activeSlide === 2} />}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint}>
          <span>Scroll to explore</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </div>
    </div>
  );
}

/* ========= SLIDE 1: Code-to-State Sync ========= */
function Slide1Visual({ active }: { active: boolean }) {
  return (
    <div key={active ? "s1-on" : "s1-off"} className={styles.mockWindow}>
      <div className={styles.mockWindowChrome}>
        <span className={styles.dot} style={{ background: "#ef4444" }} />
        <span className={styles.dot} style={{ background: "#eab308" }} />
        <span className={styles.dot} style={{ background: "#22c55e" }} />
        <span className={styles.mockWindowTitle}>inorder.ts — CodeArena</span>
      </div>
      <div className={styles.slide1Body}>
        {/* Code editor half */}
        <div className={styles.codePanel}>
          {[
            { text: "function inorder(node) {", active: false },
            { text: "  if (!node) return;", active: false },
            { text: "  inorder(node.left);", active: false },
            { text: "  result.push(node.val);", active: true },
            { text: "  inorder(node.right);", active: false },
            { text: "}", active: false },
          ].map((line, i) => (
            <div
              key={i}
              className={`${styles.codeLine} ${line.active ? styles.codeLineActive : ""}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineText}>{line.text}</span>
              {line.active && <span className={styles.activeCursor} />}
            </div>
          ))}
        </div>
        {/* Divider */}
        <div className={styles.panelDivider}>
          <div className={styles.syncArrow}>
            <div className={styles.arrowLine} />
            <div className={styles.arrowPulse} />
          </div>
        </div>
        {/* Tree node half */}
        <div className={styles.treePanel}>
          <div className={styles.treeSvgWrap}>
            <svg viewBox="0 0 160 140" className={styles.treeSvg}>
              {/* Edges */}
              <line x1="80" y1="25" x2="40" y2="75" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="80" y1="25" x2="120" y2="75" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="40" y1="75" x2="20" y2="115" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="40" y1="75" x2="60" y2="115" stroke="#a855f7" strokeWidth="2.5" className={styles.activeEdge}/>
              {/* Nodes */}
              <circle cx="80" cy="25" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2"/>
              <text x="80" y="30" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="bold">5</text>
              <circle cx="40" cy="75" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2"/>
              <text x="40" y="80" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="bold">2</text>
              <circle cx="120" cy="75" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2"/>
              <text x="120" y="80" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="bold">8</text>
              <circle cx="20" cy="115" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2"/>
              <text x="20" y="120" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="bold">1</text>
              {/* Active node */}
              <circle cx="60" cy="115" r="18" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5" className={styles.activeNode}/>
              <text x="60" y="120" textAnchor="middle" fill="#c084fc" fontSize="13" fontWeight="bold">4</text>
            </svg>
          </div>
          <div className={styles.nodeLabel}>
            <span className={styles.nodeLabelDot} />
            Visiting: <strong>4</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========= SLIDE 2: Interactive Builder ========= */
function Slide2Visual({ active }: { active: boolean }) {
  return (
    <div key={active ? "s2-on" : "s2-off"} className={styles.mockWindow}>
      <div className={styles.mockWindowChrome}>
        <span className={styles.dot} style={{ background: "#ef4444" }} />
        <span className={styles.dot} style={{ background: "#eab308" }} />
        <span className={styles.dot} style={{ background: "#22c55e" }} />
        <span className={styles.mockWindowTitle}>Tree Builder — CodeArena</span>
      </div>
      <div className={styles.slide2Body}>
        <div className={styles.builderTopBar}>
          <div className={styles.builderBadge}>Beginner Mode</div>
          <div className={styles.builderBadge} style={{background: "rgba(168,85,247,0.15)", borderColor: "#a855f7", color: "#c084fc"}}>6 nodes</div>
        </div>
        <div className={styles.builderStage}>
          <svg viewBox="0 0 260 200" className={styles.builderSvg}>
            <line x1="130" y1="30" x2="70" y2="80" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="130" y1="30" x2="190" y2="80" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="70" y1="80" x2="40" y2="140" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="70" y1="80" x2="100" y2="140" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="190" y1="80" x2="160" y2="140" stroke="#cbd5e1" strokeWidth="1.5"/>

            {/* Nodes */}
            {[ [130,30,"10"],[70,80,"5"],[190,80,"15"],[40,140,"2"],[100,140,"7"],[160,140,"12"] ].map(([cx,cy,v],i) => (
              <g key={i} className={styles.builderNode} style={{animationDelay: `${i * 0.1}s`}}>
                <circle cx={cx} cy={cy} r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5"/>
                <text x={cx} y={Number(cy)+5} textAnchor="middle" fill="#334155" fontSize="12" fontWeight="600">{v}</text>
              </g>
            ))}

            {/* "+ add" ghost node */}
            <g className={styles.addNodeGhost}>
              <circle cx="220" cy="140" r="18" fill="transparent" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3"/>
              <text x="220" y="145" textAnchor="middle" fill="#a855f7" fontSize="18">+</text>
            </g>
            <line x1="190" y1="80" x2="220" y2="140" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
          </svg>
        </div>
        <div className={styles.builderActions}>
          <button className={styles.builderBtn}>+ Add Node</button>
          <button className={styles.builderBtnGhost}>Apply &amp; Run</button>
        </div>
      </div>
    </div>
  );
}

/* ========= SLIDE 3: Recursion Stack ========= */
function Slide3Visual({ active }: { active: boolean }) {
  return (
    <div key={active ? "s3-on" : "s3-off"} className={styles.mockWindow}>
      <div className={styles.mockWindowChrome}>
        <span className={styles.dot} style={{ background: "#ef4444" }} />
        <span className={styles.dot} style={{ background: "#eab308" }} />
        <span className={styles.dot} style={{ background: "#22c55e" }} />
        <span className={styles.mockWindowTitle}>Call Stack — CodeArena</span>
      </div>
      <div className={styles.slide3Body}>
        <div className={styles.stackLabel}>Execution Stack</div>
        <div className={styles.stackArea}>
          {[
            { fn: "inorder(node.left)", val: "node = {val: 2}", delay: "0.5s", accent: true },
            { fn: "inorder(root)", val: "node = {val: 5}", delay: "0.3s", accent: false },
            { fn: "main()", val: "—", delay: "0.1s", accent: false },
          ].map((frame, i) => (
            <div
              key={i}
              className={`${styles.stackFrame} ${frame.accent ? styles.stackFrameAccent : ""}`}
              style={{ animationDelay: frame.delay }}
            >
              <div className={styles.stackFn}>{frame.fn}</div>
              <div className={styles.stackVal}>{frame.val}</div>
            </div>
          ))}
        </div>
        <div className={styles.stackDepthBadge}>Depth: 2</div>
        <div className={styles.stackPointerRow}>
          <div className={styles.stackPointerArrow}>▲ Current frame</div>
          <div className={styles.stackStep}>Step 9 / 23</div>
        </div>
      </div>
    </div>
  );
}
