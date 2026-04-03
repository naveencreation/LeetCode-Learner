"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../app/page.module.css";

const SECTION_IDS = ["home", "method", "platform", "cta"] as const;

type SectionId = (typeof SECTION_IDS)[number];

export default function LandingNav() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  const navItems = useMemo(
    () => [
      { id: "home" as const, label: "Home" },
      { id: "method" as const, label: "Method" },
      { id: "platform" as const, label: "Platform" },
      { id: "cta" as const, label: "Start" },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        // Account for header height to keep section activation aligned with view.
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    const onHashChange = () => {
      const hashId = window.location.hash.replace("#", "");
      if (SECTION_IDS.includes(hashId as SectionId)) {
        setActiveSection(hashId as SectionId);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <nav className={styles.navCenter} aria-label="Landing sections">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          className={`${styles.navLink} ${activeSection === item.id ? styles.navLinkActive : ""}`}
        >
          {item.label}
        </Link>
      ))}
      <Link href="/problems" className={styles.navLink}>
        Problems
      </Link>
    </nav>
  );
}