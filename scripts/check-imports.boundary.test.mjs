import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// The framework-boundary check in `check-imports.mjs` has exactly one failure
// mode: going vacuous. It replaced an eslint rule that did precisely that —
// the rule's glob was scoped to `src/generators/*V2/**`, and the moment the V2
// suffix was dropped from those directories it matched nothing at all while
// `npm run lint` went on reporting success. Nothing caught it because nothing
// ever asserted the rule could still fail.
//
// So this asserts the check REJECTS one violation of each shape that defeated
// the eslint rule, and — the other half, equally important — that it ACCEPTS
// the legal imports, so it can't be made to pass by simply rejecting
// everything.
//
// Each case runs the real script against a synthetic tree via
// CHECK_IMPORTS_ROOT, so nothing is ever planted in the real `src/`.

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "check-imports.mjs"
);

let root;

function write(relativePath, contents) {
  const full = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
}

// Runs the check against the synthetic tree. Returns its exit code and output
// rather than throwing, since a non-zero exit is the expected result in most
// of these cases.
function runCheck() {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath], {
      env: { ...process.env, CHECK_IMPORTS_ROOT: root },
      encoding: "utf8",
    });
    return { status: 0, stdout };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? "" };
  }
}

// The framework: a barrel plus two internal modules behind it.
function writeFramework() {
  write("src/builder/index.ts", `export const GeneratorUI = {};\n`);
  write("src/builder/engine/texture.ts", `export type Texture = unknown;\n`);
  write("src/builder/generator.ts", `export type GeneratorDefV2 = unknown;\n`);
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "check-imports-boundary-"));
  writeFramework();
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe("check-imports framework boundary", () => {
  it("accepts a generator importing the barrel, and the _common carve-out", () => {
    write(
      "src/generators/foo/fooGenerator.ts",
      `import { GeneratorUI } from "@genroot/builder";\nexport default GeneratorUI;\n`
    );
    // The carve-out: `_common/` may reach into internals by design.
    write(
      "src/generators/_common/tint.ts",
      `import { type Texture } from "@genroot/builder/engine/texture";\nexport type T = Texture;\n`
    );

    const { status, stdout } = runCheck();

    expect(stdout).toContain("0 boundary violations");
    expect(status).toBe(0);
  });

  // The eslint rule could not see `tests/` at all: `next lint` only lints
  // ["app","pages","components","lib","src"].
  it("rejects a test file reaching past the barrel", () => {
    write(
      "tests/generators/fooGenerator/foo.spec.ts",
      `import { type Texture } from "@genroot/builder/engine/texture";\nexport type T = Texture;\n`
    );

    const { status, stdout } = runCheck();

    expect(stdout).toContain("1 boundary violations");
    expect(stdout).toContain("tests/generators/fooGenerator/foo.spec.ts:1");
    expect(status).toBe(1);
  });

  // `no-restricted-imports` matches specifier text, so the relative form
  // bypassed it entirely.
  it("rejects a relative specifier that reaches past the barrel", () => {
    write(
      "src/generators/foo/fooGenerator.ts",
      `import { type Texture } from "../../builder/engine/texture";\nexport type T = Texture;\n`
    );

    const { status, stdout } = runCheck();

    expect(stdout).toContain("1 boundary violations");
    expect(stdout).toContain("src/generators/foo/fooGenerator.ts:1");
    expect(stdout).toContain("src/builder/engine/texture.ts");
    expect(status).toBe(1);
  });

  // The barrel nests above the internals it hides, and the eslint rule listed
  // `ui`/`engine` explicitly — so every other deep path was silently allowed.
  it("rejects a deep path that is neither ui/ nor engine/", () => {
    write(
      "src/generators/foo/fooGenerator.ts",
      `import { type GeneratorDefV2 } from "@genroot/builder/generator";\nexport type G = GeneratorDefV2;\n`
    );

    const { status, stdout } = runCheck();

    expect(stdout).toContain("1 boundary violations");
    expect(stdout).toContain("src/builder/generator.ts");
    expect(status).toBe(1);
  });

  // `vi.mock` takes the path as a call ARGUMENT, so it is invisible to any
  // check that only looks at import clauses.
  it("rejects a vi.mock argument that reaches past the barrel", () => {
    write(
      "tests/generators/fooGenerator/foo.spec.ts",
      `vi.mock("@genroot/builder/engine/texture", () => ({}));\n`
    );

    const { status, stdout } = runCheck();

    expect(stdout).toContain("1 boundary violations");
    expect(status).toBe(1);
  });

  // Guards the resolution ordering: `@genroot/builder` is a directory, and it
  // must resolve to the barrel's `index.ts` rather than to the directory
  // itself — otherwise the one legal import reads as a violation.
  it("treats the bare barrel specifier as the public door, not the directory", () => {
    write(
      "src/generators/foo/fooGenerator.ts",
      `import { GeneratorUI } from "@genroot/builder";\nexport default GeneratorUI;\n`
    );

    const { stdout } = runCheck();

    expect(stdout).toContain("0 boundary violations");
    expect(stdout).not.toContain("src/builder/index.ts");
  });
});
