# 🧠 CODEBASE UNDERSTANDING PROTOCOL
> **Instructions for AI:** When asked to "understand the codebase", follow this document top to bottom as a strict protocol. Do not skip sections. Do not write code until Phase 3 is complete. Acknowledge each phase before moving to the next.

---

## ⚙️ HOW TO USE THIS DOCUMENT

This is not a checklist — it's a **sequential protocol**. Each phase builds on the last.

- **Phase 1** → Get the big picture (no code yet)
- **Phase 2** → Map the structure
- **Phase 3** → Go deep into logic and data
- **Phase 4** → Understand the messy reality
- **Phase 5** → Confirm understanding before acting

At the end of each phase, the AI must output a brief summary of what it has learned before proceeding.

---

## 📋 PHASE 1 — Project Identity (Start Here)

**Goal:** Understand *what* this project is before touching a single file.

Ask or find answers to:

- [ ] **What does this application do?** (one sentence, no jargon)
- [ ] **Who uses it?** (end users, internal team, other services?)
- [ ] **What problem does it solve?**
- [ ] **What is the current status?** (MVP, production, legacy, in active dev?)
- [ ] **Are there any product docs, a README, or a one-pager?** → Read them first.
- [ ] **What are the top 3 most important things this system must never break?**

> **AI Rule:** Do not proceed to Phase 2 until you can answer all of the above in plain English.

---

## 🗺️ PHASE 2 — Architecture & Structure

**Goal:** Understand *how* the system is organized.

### 2.1 — High-Level Architecture
- [ ] Is this a monolith, microservices, serverless, or hybrid?
- [ ] Are there multiple apps/services? List them.
- [ ] What are the boundaries between components? (e.g., frontend/backend/worker/cron)
- [ ] How do the parts communicate? (REST, GraphQL, message queues, shared DB, RPC?)
- [ ] Is there a diagram? (Architecture diagram, draw.io, Notion, Miro?) → Request it.

### 2.2 — Tech Stack Inventory
Fill this in completely:

| Layer | Technology | Version (if known) |
|---|---|---|
| Language(s) | | |
| Framework(s) | | |
| Database(s) | | |
| Cache | | |
| Message Queue | | |
| Auth System | | |
| External APIs | | |
| Infrastructure | | |
| CI/CD | | |
| Hosting/Cloud | | |

### 2.3 — Folder & File Structure
- [ ] Walk the top-level directory structure.
- [ ] Identify what each top-level folder is responsible for.
- [ ] Note any non-obvious naming conventions.
- [ ] Identify entry points (e.g., `main.py`, `index.ts`, `app.js`, `server.go`).
- [ ] Identify config files (`.env`, `config/`, `settings.py`, etc.)

> **AI Rule:** Write a one-paragraph "map" of the codebase before Phase 3. Example: *"This is a Node.js monorepo. The `apps/` folder contains two services: `web` (Next.js) and `api` (Express). Shared utilities live in `packages/`. The database is Postgres accessed via Prisma..."*

---

## 🔬 PHASE 3 — Deep Internals

**Goal:** Understand *what the code actually does* and *why*.

### 3.1 — Data Models & Schema
- [ ] What are the core entities/tables/models? (e.g., User, Order, Product)
- [ ] What are the relationships? (one-to-many, many-to-many, etc.)
- [ ] Where is the schema defined? (ORM models, SQL migrations, Prisma schema, etc.)
- [ ] Are there any unusual or important fields to know about?
- [ ] Is there any business logic baked directly into the data model?

### 3.2 — Core Business Logic
Identify and read the code behind these critical flows:

- [ ] **Authentication / Authorization** — How does login work? What protects routes?
- [ ] **The main user journey** — What does a user DO in this app? Trace the happy path.
- [ ] **The most sensitive flow** — payments, data deletion, permissions, etc.
- [ ] **Background jobs / workers** — What runs on a schedule or asynchronously?
- [ ] **Error handling strategy** — How are errors caught and surfaced?

### 3.3 — APIs & Interfaces
- [ ] Is there an API spec? (OpenAPI/Swagger, Postman collection, GraphQL schema?)
- [ ] List the most important endpoints or mutations.
- [ ] How is versioning handled?
- [ ] What does the API return on success vs. failure?

### 3.4 — Configuration & Environment
- [ ] What environment variables are required?
- [ ] What's different between dev / staging / prod?
- [ ] Are there feature flags? Where are they managed?
- [ ] Any secrets management? (Vault, AWS Secrets Manager, .env files?)

> **AI Rule:** After Phase 3, write a "mental model" paragraph — a plain English description of how data flows from the user to the database and back.

---

## 🩹 PHASE 4 — Reality Check (The Messy Stuff)

**Goal:** Understand the *actual state* of the code, not just the intended design.

- [ ] **Known bugs or open issues** — Ask the developer or check issue trackers.
- [ ] **Technical debt** — Are there TODO/FIXME/HACK comments? Find them. Read them.
- [ ] **Workarounds** — Are there any "this shouldn't work but it does" patches?
- [ ] **Dead code** — Are there unused files, commented-out functions, legacy modules?
- [ ] **Inconsistencies** — Are some parts written in an older style or pattern than others?
- [ ] **Testing gaps** — What is NOT tested? What's fragile?
- [ ] **Performance concerns** — Any known slow queries, N+1 issues, memory leaks?
- [ ] **Security concerns** — Any known vulnerabilities or untrusted inputs?

### Quick Scan Commands (run these if you have terminal access):
```bash
# Find all technical debt markers
grep -r "TODO\|FIXME\|HACK\|XXX\|DEPRECATED" --include="*.ts" --include="*.js" --include="*.py" .

# Find dead/commented-out code blocks
grep -rn "\/\*.*\*\/" --include="*.ts" --include="*.js" . | head -30

# Check test coverage (Node)
npx jest --coverage --silent 2>/dev/null | tail -20

# Check for hardcoded secrets (basic scan)
grep -r "password\s*=\s*['\"]" --include="*.py" --include="*.js" --include="*.ts" .
```

> **AI Rule:** Flag anything found here explicitly. Do not silently skip debt or known issues.

---

## ✅ PHASE 5 — Confirmation & Readiness Check

**Goal:** Confirm the AI has understood enough to be genuinely helpful.

Before claiming to "understand the codebase", the AI must be able to answer:

1. What does this system do in one sentence?
2. What are the 3 most important files in the entire codebase?
3. If something breaks in production right now, where would you look first?
4. What is the most dangerous part of this codebase to change?
5. Where is the business logic most concentrated?
6. What would you need before making any changes to the auth system?
7. Is there anything you're still uncertain about?

> **AI Rule:** Answer all 7 questions out loud. If you can't answer any of them, go back and investigate before claiming understanding is complete.

---

## 📌 STANDING RULES (Always Apply)

These rules apply during and after onboarding, any time the AI is working with this codebase:

| Rule | Description |
|---|---|
| **No blind changes** | Never modify code without tracing its callers and effects first |
| **Read before write** | Always read the file fully before editing any part of it |
| **Follow the existing style** | Match the naming conventions, formatting, and patterns already in use |
| **Surface assumptions** | If you assume something about how code works, say so explicitly |
| **Flag risk before action** | If a change could break something, say so before making it |
| **Never delete without asking** | Always confirm before removing functions, files, or data |
| **Respect the tests** | If tests exist, run them. If a change breaks a test, explain why before overriding |
| **Ask about unclear ownership** | If a module has no clear owner or documentation, ask who knows it best |

---

## 🗂️ CODEBASE KNOWLEDGE CARD

*Fill this in after completing the 5 phases. Keep it at the top of context for future sessions.*

```
PROJECT NAME: ThinkDSA (Tree workspace frontend)
ONE-LINE DESCRIPTION: Interactive DSA learning platform with step-by-step visualizers and guide pages, currently focused on Binary Tree and Linked List problems.
TECH STACK (short): Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Base UI, Lucide, custom traversal engines/hooks.
ENTRY POINT: frontend/src/app/layout.tsx and frontend/src/app/page.tsx (landing), with frontend/src/app/(app)/layout.tsx as the authenticated-style app shell.
DATABASE: None (no DB integration; problem data is local TypeScript config and runtime state is in-memory).
AUTH SYSTEM: None implemented (only static 401/404/500 error routes/components).
MOST CRITICAL FLOW: Problems collection -> topic page -> visualizer route -> feature hook/engine step generation -> synchronized code/tree(or list)/result panels.
MOST FRAGILE AREA: TreeSetupModal + per-feature engine/hook contract consistency and route/problem mapping registry maintenance.
CURRENT STATUS: Active development; many tree visualizers and guides are live, linked-list visualizer foundation is added, dashboard/progress pages are still under development.
OPEN ISSUES TO BE AWARE OF: Known runtime pitfalls documented in repo memory (execution line indexing, node visual state mismatches, auto-layout ordering), zero test suite coverage, and some module duplication/inconsistency across feature folders.
LAST UPDATED BY AI: GitHub Copilot (GPT-5.3-Codex) on 2026-04-14.
```

---

*This document is a living protocol. Update the Knowledge Card whenever significant changes are made to the codebase.*