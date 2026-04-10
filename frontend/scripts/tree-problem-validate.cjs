const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function parseArgs(argv) {
  const opts = {
    feature: "",
    problemSlug: "",
    guideSlug: "",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--feature" && argv[i + 1]) {
      opts.feature = String(argv[i + 1]).trim();
      i += 1;
      continue;
    }
    if (arg === "--problem-slug" && argv[i + 1]) {
      opts.problemSlug = String(argv[i + 1]).trim();
      i += 1;
      continue;
    }
    if (arg === "--guide-slug" && argv[i + 1]) {
      opts.guideSlug = String(argv[i + 1]).trim();
      i += 1;
      continue;
    }
  }

  if (!opts.feature || !opts.problemSlug || !opts.guideSlug) {
    throw new Error(
      "Usage: node scripts/tree-problem-validate.cjs --feature <feature> --problem-slug <problem-slug> --guide-slug <guide-slug>",
    );
  }

  return opts;
}

function rel(...parts) {
  return parts.join("/");
}

function abs(relPath) {
  return path.join(ROOT, relPath);
}

function fileExists(relPath) {
  return fs.existsSync(abs(relPath));
}

function readText(relPath) {
  return fs.readFileSync(abs(relPath), "utf8");
}

function toPascalCase(input) {
  return String(input)
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function expectedLayoutName(feature) {
  // Convention used in repo: preinpostsingle -> PreInPostLayout, roottonode -> RootToNodeLayout
  const map = {
    preinpostsingle: "PreInPostLayout",
    roottonode: "RootToNodeLayout",
    maxwidth: "MaxWidthLayout",
    topview: "TopViewLayout",
    leftview: "LeftViewLayout",
    bottomview: "BottomViewLayout",
    levelorder: "LevelOrderLayout",
    preorder: "PreorderLayout",
    inorder: "InorderLayout",
    postorder: "PostorderLayout",
    diameter: "DiameterLayout",
    height: "HeightLayout",
    verticalorder: "VerticalOrderLayout",
  };
  if (map[feature]) return map[feature];
  return `${toPascalCase(feature)}Layout`;
}

function requiredFeatureFiles(feature, layoutName, hookName) {
  return [
    rel("src", "features", feature, "types.ts"),
    rel("src", "features", feature, "constants.ts"),
    rel("src", "features", feature, "engine.ts"),
    rel("src", "features", feature, "selectors.ts"),
    rel("src", "features", feature, `${hookName}.ts`),
    rel("src", "features", feature, "components", `${layoutName}.tsx`),
    rel("src", "features", feature, "components", "CodePanel.tsx"),
    rel("src", "features", feature, "components", "ExplanationPanel.tsx"),
    rel("src", "features", feature, "components", "ResultPanel.tsx"),
    rel("src", "features", feature, "components", "TreePanel.tsx"),
    rel("src", "features", feature, "components", "TreeSetupModal.tsx"),
  ];
}

function checkSectionsInGuide(guideText) {
  const requiredSnippets = [
    "Problem",
    "Intuition",
    "Dry Run",
    "Complexity",
    "Common Mistakes",
    "Interview",
    "Open Visualizer",
    "Back to Problems",
  ];

  const missing = [];
  for (const snippet of requiredSnippets) {
    if (!guideText.toLowerCase().includes(snippet.toLowerCase())) {
      missing.push(`guide missing section marker: ${snippet}`);
    }
  }
  return missing;
}

function validate(opts) {
  const errors = [];

  const layoutName = expectedLayoutName(opts.feature);
  const hookName = `use${layoutName.replace(/Layout$/, "Traversal")}`;

  const visualizerRoute = rel(
    "src",
    "app",
    "(app)",
    "problems",
    "binary-tree",
    opts.problemSlug,
    "page.tsx",
  );
  const guideRoute = rel(
    "src",
    "app",
    "(app)",
    "problems",
    "binary-tree",
    opts.guideSlug,
    "page.tsx",
  );
  const problemDataFile = rel("src", "features", "binary-tree", "problemData.ts");
  const strictMd = rel("TREE_PROBLEM_CREATION_STRICT.md");

  if (!fileExists(strictMd)) {
    errors.push(`missing strict standard file: ${strictMd}`);
  }

  const files = requiredFeatureFiles(opts.feature, layoutName, hookName);
  for (const f of files) {
    if (!fileExists(f)) {
      errors.push(`missing required file: ${f}`);
    }
  }

  if (!fileExists(visualizerRoute)) {
    errors.push(`missing visualizer route: ${visualizerRoute}`);
  }
  if (!fileExists(guideRoute)) {
    errors.push(`missing guide route: ${guideRoute}`);
  }
  if (!fileExists(problemDataFile)) {
    errors.push(`missing problem registry: ${problemDataFile}`);
  }

  if (fileExists(problemDataFile)) {
    const problemDataText = readText(problemDataFile);
    if (!problemDataText.includes(`"${opts.problemSlug}"`)) {
      errors.push(`problemData.ts missing slug entry: ${opts.problemSlug}`);
    }
  }

  const layoutFile = rel("src", "features", opts.feature, "components", `${layoutName}.tsx`);
  if (fileExists(layoutFile)) {
    const layoutText = readText(layoutFile);
    const layoutRequired = [
      "TraversalShell",
      "UnifiedControlsBar",
      "UnifiedCallStackPanel",
      "guideHref=",
    ];
    for (const marker of layoutRequired) {
      if (!layoutText.includes(marker)) {
        errors.push(`${layoutFile} missing marker: ${marker}`);
      }
    }
  }

  const hookFile = rel("src", "features", opts.feature, `${hookName}.ts`);
  if (fileExists(hookFile)) {
    const hookText = readText(hookFile);
    if (!hookText.includes("useGenericTraversal")) {
      errors.push(`${hookFile} must use useGenericTraversal`);
    }
  }

  if (fileExists(visualizerRoute)) {
    const routeText = readText(visualizerRoute);
    if (!routeText.includes(layoutName)) {
      errors.push(`${visualizerRoute} should render ${layoutName}`);
    }
  }

  if (fileExists(guideRoute)) {
    const guideText = readText(guideRoute);
    errors.push(...checkSectionsInGuide(guideText).map((msg) => `${guideRoute} ${msg}`));
  }

  return {
    errors,
    meta: {
      feature: opts.feature,
      problemSlug: opts.problemSlug,
      guideSlug: opts.guideSlug,
      layoutName,
      hookName,
      visualizerRoute,
      guideRoute,
    },
  };
}

function main() {
  try {
    const opts = parseArgs(process.argv.slice(2));
    const { errors, meta } = validate(opts);

    console.log("Tree Problem Validation");
    console.log(`feature: ${meta.feature}`);
    console.log(`problem slug: ${meta.problemSlug}`);
    console.log(`guide slug: ${meta.guideSlug}`);
    console.log(`layout: ${meta.layoutName}`);
    console.log(`hook: ${meta.hookName}`);

    if (errors.length > 0) {
      console.error("\nValidation failed:");
      for (const err of errors) {
        console.error(`- ${err}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log("\nValidation passed.");
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

main();
