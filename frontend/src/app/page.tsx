import Link from "next/link";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import landingStyles from "./landing.module.css";
import ScrollReveal from "../components/ScrollReveal";
import InteractiveShowcase from "../components/InteractiveShowcase";
import LandingNav from "../components/LandingNav";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
    <div className={`${styles.page} ${inter.className}`}>
      <header className={styles.header}>
        
        {/* Left: Brand / Logo */}
        <Link href="/" className={styles.brand}>
          <div className={styles.logoWrapper}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.logoIcon}
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          CodeArena_
        </Link>

        {/* Center: Navigation Pill */}
        <LandingNav />

        {/* Right: CTA Button */}
        <Link href="/dashboard" className={styles.ctaButton}>
          Get Started
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: "6px"}}><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </header>

      <main className={styles.main}>
        <section id="home" className={styles.hero}>
          <div className={styles.heroContent}>
            {/* Minimal Pill Badge */}
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot}></span>
              INTERACTIVE DSA
            </div>

            <h1 className={styles.heroTitle}>
              Master DSA by <br />
              watching it run.
            </h1>

            <p className={styles.heroDesc}>
              Watch data structures and recursion come to life. Step through your logic line-by-line and master algorithms faster.
            </p>

            <div className={styles.heroActions}>
              <Link href="/dashboard" className={styles.btnPrimary}>
                Start Visualizing
              </Link>
              <Link href="/problems" className={styles.btnSecondary}>
                Browse Problems
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.glowBlob}></div>
            
            {/* Back Card: Code Editor */}
            <div className={styles.editorCard}>
              <div className={styles.editorHeader}>
                <div className={styles.macButtons}>
                  <span className={styles.macClose}></span>
                  <span className={styles.macMin}></span>
                  <span className={styles.macMax}></span>
                </div>
                <div className={styles.editorTab}>inorder.py</div>
              </div>
              <div className={styles.editorBody}>
                <div className={styles.codeLine}><span className={styles.keyword}>def</span> <span className={styles.method}>inorder</span>(root):</div>
                <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.keyword}>if not</span> root: <span className={styles.keyword}>return</span></div>
                <div className={`${styles.codeLine} ${styles.activeLine}`}>&nbsp;&nbsp;inorder(root.left)</div>
                <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.function}>print</span>(root.val)</div>
                <div className={styles.codeLine}>&nbsp;&nbsp;inorder(root.right)</div>
              </div>
            </div>

            {/* Front Card: Glassmorphism Graph */}
            <div className={styles.graphCard}>
              <div className={styles.graphHeader}>
                <span className={styles.graphTitle}>Live Visualizer</span>
                <span className={styles.graphStatus}>
                  <span className={styles.statusDot}></span> Live
                </span>
              </div>
              <div className={styles.graphBody}>
                <svg width="100%" height="160" viewBox="0 0 200 160">
                   <path d="M 100 40 L 60 100" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                   <path d="M 100 40 L 140 100" stroke="#cbd5e1" strokeWidth="2" />
                   
                   <circle cx="100" cy="40" r="16" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                   <text x="100" y="44" fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">1</text>
                   
                   {/* Glowing Active Node */}
                   <circle cx="60" cy="100" r="18" fill="#a855f7" stroke="#d8b4fe" strokeWidth="4" />
                   <text x="60" y="104" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">2</text>
                   
                   <circle cx="140" cy="100" r="16" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                   <text x="140" y="104" fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">3</text>
                </svg>
              </div>
            </div>

            {/* Floating Badge */}
            <div className={styles.floatingPill}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              root.left visited
            </div>
          </div>
        </section>

        {/* --- UPGRADED WORLD CLASS SECTIONS --- */}
        
        {/* STORYTELLING / LEARNING LOOP */}
        <section id="method" className={landingStyles.sectionPad}>
          <ScrollReveal>
            <div className={landingStyles.textCenter}>
              <span className={landingStyles.eyebrow}>The Old Way is Broken</span>
              <h2 className={landingStyles.titleMain}>You do not memorize patterns.<br/>You understand algorithms.</h2>
              <p className={landingStyles.subtitleMain}>
                CodeArena replaces disjointed notebook scribbles with unified visual execution. 
                Watch call stacks, memory pointers, and output sync across your actual code.
              </p>
            </div>
          </ScrollReveal>

          <div className={landingStyles.storyWrapper}>
            <div className={landingStyles.storyContent}>
              <ScrollReveal animation="fade-up" delay={100}>
                <div className={landingStyles.storyStep}>
                  <div className={landingStyles.storyNumber}>1</div>
                  <h3 className={landingStyles.storyStepTitle}>Traditional Study Loop</h3>
                  <p className={landingStyles.storyStepDesc}>
                    Developers normally memorize one pattern at a time, dry run with disconnected notes, 
                    and lose state between recursion or queues. This leads to weak problem retention and struggle when transferring logic to new question types.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={200}>
                <div className={landingStyles.storyStep}>
                  <div className={landingStyles.storyNumber}>2</div>
                  <h3 className={landingStyles.storyStepTitle}>Visual Execution Matrix</h3>
                  <p className={landingStyles.storyStepDesc}>
                    Our engine generates state data step-by-step alongside your written code. 
                    Tracking nodes, paths, visited sets, and memory allocations in real-time gives you the exact mental model required to ace interviews.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className={landingStyles.storyVisualSticker}>
              <ScrollReveal animation="scale-up" className={landingStyles.storyVisualInner}>
                 <div className={landingStyles.storyVisualGraphic}>
                   <img src="/learning/visualization.svg" alt="Visual learning illustration" />
                 </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* INTERACTIVE APP SHOWCASE */}
        <div id="platform">
          <InteractiveShowcase />
        </div>

        {/* BOTTOM MESH CTA */}
        <section id="cta" className={landingStyles.meshCtaSection}>
          <ScrollReveal animation="scale-up" className={landingStyles.meshCtaInner}>
            <h2 className={landingStyles.meshTitle}>Stop Memorizing. Start Understanding.</h2>
            <p className={landingStyles.meshDesc}>
              Join thousands of developers mastering algorithms through true visual execution. Equip yourself with the ultimate study tool.
            </p>
            <Link href="/dashboard" className={landingStyles.meshBtn}>Start Visualizing For Free</Link>
          </ScrollReveal>
        </section>

      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.brand}>
              <div className={styles.logoWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.logoIcon}>
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              CodeArena_
            </Link>
            <p className={styles.footerTagline}>The visual learning platform for computer science.</p>
          </div>
          
          <div className={styles.footerLinksGroup}>
            <div className={styles.footerCol}>
              <span className={styles.footerColTitle}>Product</span>
              <Link href="/problems" className={styles.footerLink}>Visualizer</Link>
              <Link href="/problems" className={styles.footerLink}>Problems</Link>
              <Link href="/pricing" className={styles.footerLink}>Pricing</Link>
            </div>
            <div className={styles.footerCol}>
              <span className={styles.footerColTitle}>Resources</span>
              <Link href="/docs" className={styles.footerLink}>Documentation</Link>
              <Link href="/tutorials" className={styles.footerLink}>Tutorials</Link>
              <Link href="/blog" className={styles.footerLink}>Blog</Link>
            </div>
            <div className={styles.footerCol}>
              <span className={styles.footerColTitle}>Legal</span>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 CodeArena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

