import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

// Import-resolution and framework-boundary gate.
//
// Two checks share one scan of the tree:
//
//   1. RESOLUTION — every path-shaped string literal must resolve on disk.
//   2. BOUNDARY   — generator content and tests reach the framework only
//                   through the single `@genroot/builder` barrel.
//
// The resolution check exists because tsc and `next lint` are BLIND to broken
// asset imports: Next's ambient
// `declare module` for `*.png` / `*.jpeg` (etc) matches any specifier without
// checking the file actually exists on disk. This script is the on-disk
// check that catches those breakages ahead of a mass file-rename, along with
// any other path-shaped specifier (real imports, `require`, dynamic
// `import()`, `vi.mock`/`vi.doMock` arguments, bare repo-relative disk-path
// strings, and specifiers embedded inside template literals).
//
// Deliberately NOT an AST parse: this does a regex scan over each file's raw
// text for any quoted/backtick-delimited string literal whose content starts
// with a path-shaped prefix, then resolves that literal against the
// filesystem. This is intentionally broad (see AGENTS.md task spec) so it
// catches specifiers regardless of the syntactic position they appear in.
//
// The boundary check replaces an eslint `no-restricted-imports` rule (deleted
// in the same commit that added this) which could not do the job. It failed
// three ways, each verified empirically against this repo before the swap:
//
//   - `next lint` only ever lints ["app","pages","components","lib","src"],
//     so no eslint rule can police `tests/` at all.
//   - `no-restricted-imports` matches the specifier TEXT, so the relative form
//     `"../../builder/engine/texture"` inside a generator directory sails
//     straight through it.
//   - Post-rename the barrel (`@genroot/builder`) NESTS above the internals it
//     hides, so a text pattern must thread between `@genroot/builder` and
//     `@genroot/builder/anything` — and the old rule's explicit `ui`/`engine`
//     patterns silently allowed every other deep path, e.g.
//     `@genroot/builder/generator`.
//
// Resolving each specifier to a real path first makes all three moot: the rule
// is expressed over the file actually reached, not over the text used to reach
// it. Its own failure mode is vacuity, so it is exercised by
// `scripts/check-imports.boundary.test.mjs`, which plants one violation of
// each shape above and asserts this script rejects it.

// Normally the repo itself. `CHECK_IMPORTS_ROOT` overrides it so
// `check-imports.boundary.test.mjs` can run the real script against a small
// synthetic tree — the alternative, planting violations in the real `src/`,
// leaves debris behind if the test process dies mid-run.
const repoRoot = process.env.CHECK_IMPORTS_ROOT
  ? path.resolve(process.env.CHECK_IMPORTS_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SCAN_DIRS = ["src", "tests"];
const FILE_EXTENSIONS = [".ts", ".tsx"];

// Prefixes that mark a string literal's content as a path-shaped module
// specifier worth resolving.
const PATH_PREFIXES = ["@genroot/", "./", "../", "src/", "tests/"];

// Extensions/forms tried, in order, when resolving a specifier that has no
// explicit extension already present in the string itself.
//
// `.js` is included alongside the TS extensions because a handful of real,
// working imports in this repo point at plain `.js` library files (e.g.
// `src/builder/ui/utils/printHtmlElementLib.js`); without it those legitimate
// imports would be misreported as broken.
const RESOLUTION_EXTENSIONS = [".ts", ".tsx", ".d.ts", ".json", ".js"];
const RESOLUTION_INDEX_FILES = ["/index.ts", "/index.tsx"];

// Exactly one known exemption: a codegen template literal that emits a
// filename at runtime, so the specifier can never be resolved statically.
// Keep this list explicit and short — anything else that shows up here
// should be fixed, not allowlisted.
const ALLOWLIST = [
  {
    file: "src/tools/makeTextures/utils.ts",
    // The captured content stops at the first `${`, so the identifying
    // content for this entry is just the `./` prefix that precedes the
    // interpolation (the full source is `import image from "./${base}";`).
    content: "./",
  },
];

function isAllowlisted(relativeFile, content) {
  return ALLOWLIST.some(
    (entry) => entry.file === relativeFile && entry.content === content
  );
}

// ---------------------------------------------------------------------------
// The framework boundary.
//
// `src/builder` is the generator framework. Generator content and tests are
// consumers of it, and they get exactly one door: the barrel at
// `src/builder/index.ts`, which exports `GeneratorRenderer`, `GeneratorUI` and
// the shared type vocabulary. Reaching any other file under `src/builder` —
// by alias, by relative path, type-only, or from a `vi.mock` argument — is a
// boundary violation.
//
// `src/builder/**` itself is not a consumer: the barrel's whole job is to
// import the internals it re-exports.

const FRAMEWORK_DIR = "src/builder";
const FRAMEWORK_PUBLIC_DOOR = "src/builder/index.ts";

const BOUNDARY_CONSUMER_PREFIXES = ["src/generators/", "tests/"];

// `src/generators/_common/` is a DOCUMENTED CARVE-OUT, and inherits the same
// exemption the deleted eslint rule gave it (`excludedFiles`).
//
// `_common/` is the generator-owned home for the controls that are too
// Minecraft-specific to be framework (skin pickers, tint selector, glint, the
// texture-version registries and their codegen output). The carve-out was
// revisited after Phase D: 25 current `_common/` `.ts`/`.tsx` files reach 20
// distinct internal targets spanning engine canvas, model, rendering, and
// texture helpers; `renderContextAdapter`; and UI texture-picker, form, and
// Minecraft-skin primitives.
//
// Routing those through the barrel would still re-export broad internals from
// the one door built to narrow them — inverting the boundary in order to
// satisfy the check that enforces it. Phase D removed `defineTintInput` and the
// dead `_common/texturePicker/`, but did not remove this remaining architectural
// need.
const BOUNDARY_CARVE_OUTS = ["src/generators/_common/"];

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function isBoundaryConsumer(relativeFile) {
  const posix = toPosix(relativeFile);
  return (
    BOUNDARY_CONSUMER_PREFIXES.some((prefix) => posix.startsWith(prefix)) &&
    !BOUNDARY_CARVE_OUTS.some((prefix) => posix.startsWith(prefix))
  );
}

// Given the path a specifier actually resolved to, is reaching it a boundary
// violation? Expressed over the resolved file rather than the specifier text,
// which is what makes relative specifiers and the nested barrel a non-issue.
function isBoundaryViolation(resolvedPath) {
  const posix = toPosix(path.relative(repoRoot, resolvedPath));
  return (
    (posix === FRAMEWORK_DIR || posix.startsWith(`${FRAMEWORK_DIR}/`)) &&
    posix !== FRAMEWORK_PUBLIC_DOOR
  );
}

function collectFiles(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    if (entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectFiles(fullPath, out);
    } else if (
      entry.isFile() &&
      FILE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
    ) {
      out.push(fullPath);
    }
  }

  return out;
}

function lineNumberAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10 /* \n */) {
      line += 1;
    }
  }
  return line;
}

// Builds a regex that matches, for a given quote character, an opening
// quote immediately followed by one of the path-shaped prefixes, then
// captures every subsequent character up to (but not including) whichever
// comes first: the same closing quote character, or a `${` interpolation
// start.
function buildQuoteRegex(quoteChar) {
  return new RegExp(
    `${quoteChar}(@genroot/|\\.\\.?/|src/|tests/)((?:(?!${quoteChar}|\\$\\{).)*)`,
    "gs"
  );
}

const QUOTE_CHARS = ["'", '"', "`"];
const QUOTE_REGEXES = QUOTE_CHARS.map((q) => ({ q, re: buildQuoteRegex(q) }));

// Blank out comment text before scanning for candidates, replacing comment
// characters with spaces (newlines are preserved so line numbers computed
// from the result still line up with the original file). This repo's doc
// comments routinely use backtick-quoted path fragments for prose (e.g.
// "an eslint boundary rule for `src/generators/*/`") which are not real
// template literals — left unstripped they read as bogus, unresolvable
// specifiers. Line comments are stripped before block comments so a `/*`
// substring that only exists incidentally inside a `//` comment (e.g. the
// trailing `/*` of a wildcard path like `@genroot/builder/ui/*`) can't be
// mistaken for the start of a block comment spanning into real code.
function stripLineComments(text) {
  let result = "";
  let i = 0;
  while (i < text.length) {
    const nl = text.indexOf("\n", i);
    const lineEnd = nl === -1 ? text.length : nl;
    const line = text.slice(i, lineEnd);
    const commentIdx = line.indexOf("//");
    if (commentIdx === -1) {
      result += line;
    } else {
      result +=
        line.slice(0, commentIdx) + " ".repeat(line.length - commentIdx);
    }
    if (nl !== -1) {
      result += "\n";
    }
    i = lineEnd + 1;
  }
  return result;
}

function stripBlockComments(text) {
  let result = "";
  let i = 0;
  while (i < text.length) {
    const start = text.indexOf("/*", i);
    if (start === -1) {
      result += text.slice(i);
      break;
    }
    result += text.slice(i, start);
    const end = text.indexOf("*/", start + 2);
    const spanEnd = end === -1 ? text.length : end + 2;
    for (let j = start; j < spanEnd; j += 1) {
      result += text[j] === "\n" ? "\n" : " ";
    }
    i = spanEnd;
  }
  return result;
}

function stripComments(text) {
  return stripBlockComments(stripLineComments(text));
}

function extractCandidates(text) {
  const candidates = [];

  for (const { q, re } of QUOTE_REGEXES) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(text)) !== null) {
      const quoteIndex = match.index;
      const contentStart = quoteIndex + 1;
      const content = match[1] + match[2];
      const contentEnd = contentStart + content.length;
      const interpolated = text.slice(contentEnd, contentEnd + 2) === "${";

      candidates.push({
        content,
        interpolated,
        line: lineNumberAt(text, quoteIndex),
      });

      // Avoid re-scanning inside this match on the next iteration when the
      // regex is zero-width-adjacent; not strictly necessary since exec
      // advances lastIndex past the match, but guards against pathological
      // empty matches.
      if (re.lastIndex === match.index) {
        re.lastIndex += 1;
      }
    }
  }

  return candidates;
}

function isExistingFile(candidatePath) {
  try {
    return fs.statSync(candidatePath).isFile();
  } catch {
    return false;
  }
}

function exists(candidatePath) {
  try {
    fs.statSync(candidatePath);
    return true;
  } catch {
    return false;
  }
}

// Returns the absolute path the specifier resolves to, or `null` if it does
// not resolve. (It returns the path rather than a boolean so the boundary
// check can ask *what* was reached, not merely whether something was.)
function resolveSpecifier(content, importingFilePath) {
  let resolvedBase;

  if (content.startsWith("@genroot/")) {
    resolvedBase = path.join(
      repoRoot,
      "src",
      content.slice("@genroot/".length)
    );
  } else if (content.startsWith("./") || content.startsWith("../")) {
    resolvedBase = path.resolve(path.dirname(importingFilePath), content);
  } else if (content.startsWith("src/") || content.startsWith("tests/")) {
    resolvedBase = path.join(repoRoot, content);
  } else {
    // Should be unreachable given the prefix filter in extractCandidates.
    return null;
  }

  if (isExistingFile(resolvedBase)) {
    return resolvedBase;
  }

  for (const ext of RESOLUTION_EXTENSIONS) {
    if (isExistingFile(resolvedBase + ext)) {
      return resolvedBase + ext;
    }
  }

  for (const indexSuffix of RESOLUTION_INDEX_FILES) {
    if (isExistingFile(resolvedBase + indexSuffix)) {
      return resolvedBase + indexSuffix;
    }
  }

  // A directory that is not a package — some candidates are bare
  // repo-relative disk paths used for direct filesystem access (e.g. a tool
  // script resolving a textures *directory*), not module specifiers, so there
  // is no file extension or index file to find. Tried last so that a
  // directory holding an `index.ts` resolves to that index file: `@genroot/builder`
  // must land on `src/builder/index.ts`, the barrel, and not on the directory,
  // or the boundary check below would read the one legal import as a
  // violation. Resolution verdicts are unaffected by the ordering — both
  // branches mean "resolved".
  if (exists(resolvedBase)) {
    return resolvedBase;
  }

  return null;
}

function main() {
  const files = SCAN_DIRS.flatMap((dir) =>
    collectFiles(path.join(repoRoot, dir), [])
  );

  let specifierCount = 0;
  let unresolvedCount = 0;
  let allowlistedCount = 0;
  const unresolvedReports = [];
  const allowlistedReports = [];
  const boundaryReports = [];

  for (const filePath of files) {
    const relativeFile = path.relative(repoRoot, filePath);
    const consumer = isBoundaryConsumer(relativeFile);
    const text = fs.readFileSync(filePath, "utf8");
    const candidates = extractCandidates(stripComments(text));

    for (const candidate of candidates) {
      specifierCount += 1;

      if (candidate.interpolated) {
        if (isAllowlisted(relativeFile, candidate.content)) {
          allowlistedCount += 1;
          allowlistedReports.push({
            relativeFile,
            line: candidate.line,
            specifier: `${candidate.content}\${...}`,
          });
          continue;
        }
        unresolvedCount += 1;
        unresolvedReports.push({
          relativeFile,
          line: candidate.line,
          specifier: `${candidate.content}\${...}`,
        });
        continue;
      }

      const resolved = resolveSpecifier(candidate.content, filePath);
      if (!resolved) {
        unresolvedCount += 1;
        unresolvedReports.push({
          relativeFile,
          line: candidate.line,
          specifier: candidate.content,
        });
        continue;
      }

      if (consumer && isBoundaryViolation(resolved)) {
        boundaryReports.push({
          relativeFile,
          line: candidate.line,
          specifier: candidate.content,
          resolvedFile: toPosix(path.relative(repoRoot, resolved)),
        });
      }
    }
  }

  console.log(
    `check:imports — ${files.length} files scanned, ${specifierCount} specifiers checked, ${unresolvedCount} unresolved, ${boundaryReports.length} boundary violations`
  );

  if (allowlistedReports.length > 0) {
    for (const report of allowlistedReports) {
      console.log(
        `  (allowlisted, skipped) ${report.relativeFile}:${report.line}  ${report.specifier}`
      );
    }
  }

  if (unresolvedReports.length > 0) {
    for (const report of unresolvedReports) {
      console.log(`${report.relativeFile}:${report.line}  ${report.specifier}`);
    }
  }

  if (boundaryReports.length > 0) {
    console.log(
      "\nFramework boundary violations — generators and tests import from" +
        " the `@genroot/builder` barrel only:"
    );
    for (const report of boundaryReports) {
      console.log(
        `${report.relativeFile}:${report.line}  ${report.specifier}  ->  ${report.resolvedFile}`
      );
    }
    console.log(
      "\nImport from `@genroot/builder` instead. If the export you need is" +
        " missing, add it to the barrel (src/builder/index.ts) rather than" +
        " reaching past it. Minecraft-specific controls are not framework —" +
        " they live in src/generators/_common/."
    );
  }

  process.exitCode =
    unresolvedReports.length > 0 || boundaryReports.length > 0 ? 1 : 0;
}

main();
