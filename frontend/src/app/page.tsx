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

        {/* Learning Loop Section */}
        <section className={styles.learningProof}>
          <div className={styles.learningHeader}>
            <p className={styles.learningEyebrow}>HOW CODEARENA TEACHES</p>
            <h2 className={styles.learningTitle}>You do not memorize patterns. You understand algorithms.</h2>
            <p className={styles.learningSubtitle}>CodeArena connects code, state, and outputs across Trees, Graphs, Dynamic Programming, and Arrays so learners build transferable intuition.</p>
          </div>

          <div className={styles.learningRows}>
            <div className={styles.learningRow}>
            <article className={styles.studyPanel}>
              <h3 className={styles.panelTitle}>Traditional Study Loop</h3>
              <ol className={styles.studyList}>
                <li>Memorize one pattern at a time</li>
                <li>Dry run with disconnected notes</li>
                <li>Lose state between recursion, queues, or tables</li>
                <li>Struggle to transfer learning to new problem types</li>
              </ol>
              <p className={styles.panelMeta}>Result: Correct answer sometimes, weak transfer to new problems.</p>
            </article>

            <article className={styles.learningSvgPanel}>
              <div className={styles.learningSvgWrap}>
                <img src="/learning/not-understand.svg" alt="Student struggling with traditional study approach" className={styles.learningSvg} />
              </div>
            </article>
            </div>

            <div className={styles.learningRow}>
            <article className={styles.learningSvgPanel}>
              <div className={styles.learningSvgWrap}>
                <img src="/learning/visualization.svg" alt="Visual learning illustration" className={styles.learningSvg} />
              </div>
            </article>

            <article className={styles.visualPanel}>
              <h3 className={styles.panelTitle}>CodeArena Learning Loop</h3>
              <div className={styles.domainTabs}>
                <span className={styles.tabsGlider}></span>
                <span className={`${styles.domainTab} ${styles.domainTabActive}`}>Trees</span>
                <span className={styles.domainTab}>Graphs</span>
                <span className={styles.domainTab}>Linked List</span>
                <span className={styles.domainTab}>Queue</span>
              </div>
              <div className={styles.visualStage}>
                <div className={styles.carouselViewport}>
                  <div className={styles.carouselStack}>
                    <article className={`${styles.carouselSlide} ${styles.slideTrees}`}>
                      <h4 className={styles.slideTitle}>Trees: Traversal Intuition</h4>
                      <p className={styles.slideDesc}>Watch call-stack + node activation together.</p>
                      <div className={styles.treeSlideLayout}>
                        <div className={styles.treeCanvas}>
                          <svg className={styles.slideTreeSvg} viewBox="0 0 220 150">
                            <path d="M110 26 L70 78" className={styles.slideEdge} />
                            <path d="M110 26 L150 78" className={`${styles.slideEdge} ${styles.slideEdgeAnimated}`} />
                            <circle cx="110" cy="26" r="14" className={styles.slideNodeDone} />
                            <circle cx="70" cy="78" r="14" className={styles.slideNodeDone} />
                            <circle cx="150" cy="78" r="15" className={styles.slideNodeActive} />
                            <text x="110" y="31">1</text>
                            <text x="70" y="83">2</text>
                            <text x="150" y="83">3</text>
                          </svg>
                          <div className={styles.treeOutputChip}>Output so far: [2, 1]</div>
                        </div>

                        <aside className={styles.treeInsightPanel}>
                          <p className={styles.treeInsightTitle}>What is happening now</p>
                          <div className={`${styles.treeInsightRow} ${styles.treeInsightActive}`}>
                            <span className={styles.treeStepDot}></span>
                            <span>Current node: 3</span>
                          </div>
                          <div className={styles.treeInsightRow}>
                            <span className={styles.treeStepDot}></span>
                            <span>Call stack: inorder(1) -&gt; inorder(3)</span>
                          </div>
                          <div className={styles.treeInsightRow}>
                            <span className={styles.treeStepDot}></span>
                            <span>Next action: visit node then return</span>
                          </div>
                          <div className={styles.treeInsightMeta}>Why this matters: learners see recursion flow instead of memorizing order.</div>
                        </aside>
                      </div>
                    </article>

                    <article className={`${styles.carouselSlide} ${styles.slideGraphs}`}>
                      <h4 className={styles.slideTitle}>Graphs: BFS / DFS Flow</h4>
                      <p className={styles.slideDesc}>Track visited set, queue, and frontier live.</p>
                      <div className={styles.graphSlideLayout}>
                        <div className={styles.graphCanvas}>
                          <svg className={styles.graphSvg} viewBox="0 0 220 150">
                            <path className={styles.graphEdge} d="M36 54 L96 32" />
                            <path className={styles.graphEdge} d="M36 54 L88 98" />
                            <path className={styles.graphEdge} d="M96 32 L146 54" />
                            <path className={styles.graphEdge} d="M88 98 L146 54" />
                            <path className={`${styles.graphEdge} ${styles.graphEdgeActive}`} d="M146 54 L184 100" />

                            <circle className={styles.graphNodeDone} cx="36" cy="54" r="12" />
                            <circle className={styles.graphNodeDone} cx="96" cy="32" r="12" />
                            <circle className={styles.graphNodeDone} cx="88" cy="98" r="12" />
                            <circle className={styles.graphNodeCurrent} cx="146" cy="54" r="13" />
                            <circle className={styles.graphNodeNext} cx="184" cy="100" r="12" />

                            <text x="36" y="58">A</text>
                            <text x="96" y="36">B</text>
                            <text x="88" y="102">C</text>
                            <text x="146" y="58">D</text>
                            <text x="184" y="104">E</text>
                          </svg>
                          <div className={styles.graphQueue}>Queue: [B, C, E]</div>
                        </div>

                        <aside className={styles.graphInsightPanel}>
                          <p className={styles.graphInsightTitle}>What is happening now</p>
                          <div className={`${styles.graphInsightRow} ${styles.graphInsightActive}`}>
                            <span className={styles.graphStepDot}></span>
                            <span>Current node: D</span>
                          </div>
                          <div className={styles.graphInsightRow}>
                            <span className={styles.graphStepDot}></span>
                            <span>Visited: A, B, C</span>
                          </div>
                          <div className={styles.graphInsightRow}>
                            <span className={styles.graphStepDot}></span>
                            <span>Next expansion: E</span>
                          </div>
                          <div className={styles.graphInsightMeta}>Why this matters: learners understand frontier expansion, not just node order.</div>
                        </aside>
                      </div>
                    </article>

                    <article className={`${styles.carouselSlide} ${styles.slideDp}`}>
                      <h4 className={styles.slideTitle}>Linked List: Pointer Flow</h4>
                      <p className={styles.slideDesc}>Understand next-pointer transitions and insertion updates visually.</p>
                      <div className={styles.linkedSlideLayout}>
                        <div className={styles.linkedCanvas}>
                          <div className={styles.linkedListMini}>
                            <div className={styles.llNode}>12</div>
                            <span className={`${styles.llArrow} ${styles.llFlow}`}>→</span>
                            <div className={`${styles.llNode} ${styles.llNodeActive}`}>24</div>
                            <span className={`${styles.llArrow} ${styles.llFlow}`}>→</span>
                            <div className={styles.llNode}>31</div>
                            <span className={styles.llArrow}>→</span>
                            <div className={styles.llNode}>42</div>
                          </div>
                          <div className={styles.llPointers}>
                            <span>head</span>
                            <span>current</span>
                            <span>tail</span>
                          </div>
                        </div>

                        <aside className={styles.linkedInsightPanel}>
                          <p className={styles.linkedInsightTitle}>What is happening now</p>
                          <div className={`${styles.linkedInsightRow} ${styles.linkedInsightActive}`}>
                            <span className={styles.linkedStepDot}></span>
                            <span>Current node: 24</span>
                          </div>
                          <div className={styles.linkedInsightRow}>
                            <span className={styles.linkedStepDot}></span>
                            <span>next points to: 31</span>
                          </div>
                          <div className={styles.linkedInsightRow}>
                            <span className={styles.linkedStepDot}></span>
                            <span>Operation: traverse / insert-ready</span>
                          </div>
                          <div className={styles.linkedInsightMeta}>Why this matters: learners understand pointer rewiring without guesswork.</div>
                        </aside>
                      </div>
                    </article>

                    <article className={`${styles.carouselSlide} ${styles.slideArrays}`}>
                      <h4 className={styles.slideTitle}>Queue: First-In First-Out</h4>
                      <p className={styles.slideDesc}>See enqueue/dequeue order and front/rear updates live.</p>
                      <div className={styles.queueSlideLayout}>
                        <div className={styles.queueCanvas}>
                          <div className={styles.queueMini}>
                            <span className={styles.queueLabelFront}>Front</span>
                            <div className={styles.queueCells}>
                              <div className={styles.queueCell}>14</div>
                              <div className={styles.queueCell}>21</div>
                              <div className={`${styles.queueCell} ${styles.queueCellActive}`}>35</div>
                              <div className={styles.queueCell}>47</div>
                            </div>
                            <span className={styles.queueLabelRear}>Rear</span>
                          </div>
                          <div className={styles.queueOps}>
                            <span>enqueue(52)</span>
                            <span>dequeue()</span>
                          </div>
                        </div>

                        <aside className={styles.queueInsightPanel}>
                          <p className={styles.queueInsightTitle}>What is happening now</p>
                          <div className={`${styles.queueInsightRow} ${styles.queueInsightActive}`}>
                            <span className={styles.queueStepDot}></span>
                            <span>Current front: 14</span>
                          </div>
                          <div className={styles.queueInsightRow}>
                            <span className={styles.queueStepDot}></span>
                            <span>Current rear: 47</span>
                          </div>
                          <div className={styles.queueInsightRow}>
                            <span className={styles.queueStepDot}></span>
                            <span>Next operation: enqueue(52)</span>
                          </div>
                          <div className={styles.queueInsightMeta}>Why this matters: learners visualize FIFO order and operation effects instantly.</div>
                        </aside>
                      </div>
                    </article>
                  </div>
                </div>
                <div className={styles.carouselNote}>Carousel previews how CodeArena teaches each algorithm family with visuals + state.</div>
              </div>

              <ul className={styles.visualList}>
                <li>See the active state for any algorithm family</li>
                <li>Track transitions in stacks, queues, tables, and pointers</li>
                <li>Connect each line of code to immediate visual feedback</li>
              </ul>
            </article>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresHeader}>
            <p className={styles.featuresEyebrow}>POWERFUL UNDER THE HOOD</p>
            <h2 className={styles.featuresTitle}>Built for execution, not just animation.</h2>
          </div>
          <div className={styles.featuresGrid}>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              </div>
              <h3 className={styles.featureName}>Real Code, Real Execution</h3>
              <p className={styles.featureDesc}>We don't fake animations. Your code actually runs in our secure sandbox, generating step-by-step state data.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className={styles.featureName}>Time-Travel Debugging</h3>
              <p className={styles.featureDesc}>Scrub back and forth through your execution history. Found a bug? Rewind to the exact line that broke your state.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
              </div>
              <h3 className={styles.featureName}>Memory & Pointers</h3>
              <p className={styles.featureDesc}>Watch memory allocation live. Pointers, references, and objects are visually tracked so you never lose the head node again.</p>
            </div>

          </div>
        </section>

        {/* Bottom CTA */}
        <section className={styles.bottomCtaSection}>
          <div className={styles.bottomCtaBox}>
            <div className={styles.ctaBlob}></div>
            <h2 className={styles.ctaTitle}>Ready to stop memorizing?</h2>
            <p className={styles.ctaDesc}>Join thousands of developers mastering algorithms through true visual execution.</p>
            <div className={styles.ctaActions}>
              <Link href="/dashboard" className={styles.btnPrimary}>Start Visualizing Now</Link>
            </div>
          </div>
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

