const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const DEFAULT_GUIDE = "src/app/(app)/problems/binary-tree/diameter-guide/page.tsx";
const DEFAULT_LAYOUT = "src/features/diameter/components/DiameterLayout.tsx";

function parseArgs(argv) {
  const options = {
    fix: false,
    allGuides: true,
    allLayouts: true,
    guides: [],
    layouts: [],
    maxIterations: 3,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--fix") {
      options.fix = true;
      continue;
    }
    if (arg === "--all-guides") {
      options.allGuides = true;
      continue;
    }
    if (arg === "--all-layouts") {
      options.allLayouts = true;
      continue;
    }
    if (arg === "--guide" && argv[i + 1]) {
      options.allGuides = false;
      options.guides.push(argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg === "--layout" && argv[i + 1]) {
      options.allLayouts = false;
      options.layouts.push(argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg === "--max-iterations" && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (Number.isFinite(parsed) && parsed > 0) {
        options.maxIterations = Math.floor(parsed);
      }
      i += 1;
      continue;
    }
  }

  return options;
}

function walkFiles(baseDir) {
  if (!fs.existsSync(baseDir)) {
    return [];
  }

  const results = [];
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function toRelative(filePath) {
  const rel = path.relative(ROOT, filePath);
  return rel.split(path.sep).join("/");
}

function existsRel(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function normalizeRel(relPath) {
  return relPath.split("\\").join("/");
}

function getGuideTargets(options) {
  const targets = new Set();

  if (options.allGuides) {
    const base = path.join(ROOT, "src/app/(app)/problems/binary-tree");
    for (const abs of walkFiles(base)) {
      const rel = toRelative(abs);
      if (rel.endsWith("-guide/page.tsx")) {
        targets.add(rel);
      }
    }
  }

  for (const guide of options.guides) {
    targets.add(normalizeRel(guide));
  }

  if (targets.size === 0 && !options.allGuides) {
    targets.add(DEFAULT_GUIDE);
  }

  return Array.from(targets).filter(existsRel);
}

function getLayoutTargets(options) {
  const targets = new Set();

  if (options.allLayouts) {
    const base = path.join(ROOT, "src/features");
    for (const abs of walkFiles(base)) {
      const rel = toRelative(abs);
      if (rel.endsWith("Layout.tsx") && rel.includes("/components/")) {
        targets.add(rel);
      }
    }
  }

  for (const layout of options.layouts) {
    targets.add(normalizeRel(layout));
  }

  if (targets.size === 0 && !options.allLayouts) {
    targets.add(DEFAULT_LAYOUT);
  }

  return Array.from(targets).filter(existsRel);
}

function checkGuidePage(filePath, text) {
  const failures = [];

  const requiredContains = [
    '"use client"',
    "function QuickMode()",
    "function DeepMode()",
    "const DRY_RUN_STEPS",
    "const TRACE_STEPS",
    "const COMMON_MISTAKES",
    "Quick Recap",
    "Deep Explain",
    "Visual Editor",
    "Tree Problems",
    "Open Visualizer",
  ];

  for (const marker of requiredContains) {
    if (!text.includes(marker)) {
      failures.push(`missing marker: ${marker}`);
    }
  }

  if (!text.includes("const INTERVIEW_ITEMS") && !text.includes("const QA_ITEMS")) {
    failures.push("missing one of: const INTERVIEW_ITEMS or const QA_ITEMS");
  }

  const modeRegex = /const\s*\[\s*mode\s*,\s*setMode\s*\]\s*=\s*useState<\"quick\"\s*\|\s*\"deep\">\(\"quick\"\);/;
  if (!modeRegex.test(text)) {
    failures.push("mode state signature is not exact quick/deep form");
  }

  const exportRegex = /export default function\s+([A-Za-z0-9_]+)\s*\(/;
  const exportMatch = text.match(exportRegex);
  if (!exportMatch) {
    failures.push("missing named default export function");
  } else if (!exportMatch[1].endsWith("GuidePage")) {
    failures.push("default export function name must end with GuidePage");
  }

  return failures;
}

function checkLayoutPage(filePath, text) {
  const failures = [];

  const requiredContains = [
    "ProblemFocusHeader",
    "ResizableTraversalGrid",
    "left={",
    "middleTop={",
    "middleBottom={",
    "middleFooter={",
    "rightTop={",
    "rightBottom={",
    "Reset Layout",
    "onResetReady={(resetFn) => setResetLayout(() => resetFn)}",
  ];

  for (const marker of requiredContains) {
    if (!text.includes(marker)) {
      failures.push(`missing marker: ${marker}`);
    }
  }

  const resetStateRegex = /const\s*\[\s*resetLayout\s*,\s*setResetLayout\s*\]\s*=\s*useState<\(\(\)\s*=>\s*void\)\s*\|\s*null>\(null\);/;
  if (!resetStateRegex.test(text)) {
    failures.push("resetLayout state typing must be useState<(() => void) | null>(null)");
  }

  const featureMatch = filePath.match(/^src\/features\/([^/]+)\/components\//);
  const ownFeature = featureMatch ? featureMatch[1] : null;
  const importRegex = /^import\s+[^;]+\s+from\s+["']@\/features\/([^/]+)\/components\/[^"']+["'];/gm;
  let importMatch;
  while ((importMatch = importRegex.exec(text)) !== null) {
    const importedFeature = importMatch[1];
    if (ownFeature && importedFeature !== ownFeature && importedFeature !== "shared") {
      failures.push(`cross-feature component import in layout: ${importMatch[0]}`);
    }
  }

  return failures;
}

function autoFixGuideText(text) {
  let next = text;
  let changed = false;

  const modeRegex = /const\s*\[\s*mode\s*,\s*setMode\s*\]\s*=\s*useState<[^>]+>\((?:"quick"|'quick')\);/;
  if (modeRegex.test(next)) {
    const replaced = next.replace(
      modeRegex,
      'const [mode, setMode] = useState<"quick" | "deep">("quick");',
    );
    if (replaced !== next) {
      next = replaced;
      changed = true;
    }
  }

  const exportRegex = /export default function\s+([A-Za-z0-9_]+)\s*\(/;
  const exportMatch = next.match(exportRegex);
  if (exportMatch && !exportMatch[1].endsWith("GuidePage")) {
    const renamed = `${exportMatch[1]}GuidePage`;
    next = next.replace(exportRegex, `export default function ${renamed}(`);
    changed = true;
  }

  return { text: next, changed };
}

function autoFixLayoutText(text) {
  let next = text;
  let changed = false;

  const resetStateLooseRegex = /const\s*\[\s*resetLayout\s*,\s*setResetLayout\s*\]\s*=\s*useState\(null\);/;
  if (resetStateLooseRegex.test(next)) {
    next = next.replace(
      resetStateLooseRegex,
      "const [resetLayout, setResetLayout] = useState<(() => void) | null>(null);",
    );
    changed = true;
  }

  const badResetPatterns = [
    /onResetReady=\{setResetLayout\}/g,
    /onResetReady=\{\(resetFn\)\s*=>\s*setResetLayout\(resetFn\)\}/g,
    /onResetReady=\{\(resetFn\)\s*=>\s*setResetLayout\(\(\)\s*=>\s*\(\)\s*=>\s*resetFn\(\)\)\}/g,
  ];

  for (const pattern of badResetPatterns) {
    if (pattern.test(next)) {
      next = next.replace(
        pattern,
        "onResetReady={(resetFn) => setResetLayout(() => resetFn)}",
      );
      changed = true;
    }
  }

  return { text: next, changed };
}

function runChecks(guideTargets, layoutTargets) {
  const allFailures = [];

  for (const rel of guideTargets) {
    const abs = path.join(ROOT, rel);
    const text = fs.readFileSync(abs, "utf8");
    const failures = checkGuidePage(rel, text);
    if (failures.length > 0) {
      allFailures.push({ file: rel, type: "guide", failures });
    }
  }

  for (const rel of layoutTargets) {
    const abs = path.join(ROOT, rel);
    const text = fs.readFileSync(abs, "utf8");
    const failures = checkLayoutPage(rel, text);
    if (failures.length > 0) {
      allFailures.push({ file: rel, type: "layout", failures });
    }
  }

  return allFailures;
}

function runAutoFix(guideTargets, layoutTargets) {
  let changedFiles = 0;

  for (const rel of guideTargets) {
    const abs = path.join(ROOT, rel);
    const text = fs.readFileSync(abs, "utf8");
    const fixed = autoFixGuideText(text);
    if (fixed.changed) {
      fs.writeFileSync(abs, fixed.text, "utf8");
      changedFiles += 1;
    }
  }

  for (const rel of layoutTargets) {
    const abs = path.join(ROOT, rel);
    const text = fs.readFileSync(abs, "utf8");
    const fixed = autoFixLayoutText(text);
    if (fixed.changed) {
      fs.writeFileSync(abs, fixed.text, "utf8");
      changedFiles += 1;
    }
  }

  return changedFiles;
}

function printFailures(failures) {
  for (const item of failures) {
    console.error(`\n[FAIL] ${item.type.toUpperCase()} ${item.file}`);
    for (const detail of item.failures) {
      console.error(`  - ${detail}`);
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const guideTargets = getGuideTargets(options);
  const layoutTargets = getLayoutTargets(options);

  if (guideTargets.length === 0 && layoutTargets.length === 0) {
    console.error("No target files found.");
    process.exit(1);
  }

  console.log("Tree micro compliance runner");
  console.log(`Guide targets: ${guideTargets.length}`);
  console.log(`Layout targets: ${layoutTargets.length}`);

  if (!options.fix) {
    const failures = runChecks(guideTargets, layoutTargets);
    if (failures.length > 0) {
      printFailures(failures);
      process.exit(1);
    }

    console.log("PASS: all selected files satisfy micro compliance rules.");
    process.exit(0);
  }

  for (let iteration = 1; iteration <= options.maxIterations; iteration += 1) {
    console.log(`\nIteration ${iteration}/${options.maxIterations}`);

    const changedFiles = runAutoFix(guideTargets, layoutTargets);
    console.log(`Auto-fix touched files: ${changedFiles}`);

    const failures = runChecks(guideTargets, layoutTargets);
    if (failures.length === 0) {
      console.log("PASS: all selected files satisfy micro compliance rules.");
      process.exit(0);
    }

    if (iteration === options.maxIterations) {
      printFailures(failures);
      process.exit(1);
    }

    if (changedFiles === 0) {
      console.log("No further auto-fixes available; failing early.");
      printFailures(failures);
      process.exit(1);
    }
  }
}

main();
