import Link from "next/link";
import { Inter } from "next/font/google";
import styles from "./page.module.css";

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
        <nav className={styles.navCenter}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/traversals" className={styles.navLink}>Traversals</Link>
          <Link href="/problems" className={`${styles.navLink} ${styles.navLinkActive}`}>Problems</Link>
          <Link href="/stook" className={styles.navLink}>Logic</Link>
          
          <div className={styles.navDropdownItem}>
            <span className={styles.navLink}>
              Pricing
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: "4px"}}><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </div>

          <Link href="/docs" className={styles.navLink}>Docs</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
        </nav>

        {/* Right: CTA Button */}
        <Link href="/dashboard" className={styles.ctaButton}>
          Get Started
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: "6px"}}><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
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
      </main>
    </div>
  );
}
