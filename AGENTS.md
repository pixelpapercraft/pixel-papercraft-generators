# Project Context

This project is a papercraft template generator focused mainly on Minecraft-inspired designs.

It includes many generators that turn characters, creatures, items, and other game-themed subjects into printable paper templates. Many of these generators let a player use their own Minecraft skin to create unusual variants of themselves, such as creeper-themed or cow-themed versions.

# Agent Rules

## Tools

- Always use the `gh` command for GitHub operations.
- For GitHub actions that need this project's maintainer permissions (for
  example, closing a pull request), run `direnv exec . gh <command>` from the
  repository root. This loads the project GitHub account; use ordinary `gh`
  commands for read-only work unless those permissions are needed. Never print
  or record the token supplied by `direnv`.
- After creating a new git worktree for this repo, run `npm install` and then `npm run setup` in the new worktree before running checks or making changes.

## Skills

- Skills live at `.agents/skills/<skill-name>/SKILL.md` — that's the real, git-tracked location. Claude Code doesn't look there by default, so `.claude/skills` is a symlink to `../.agents/skills` to make them discoverable.
- Editing a skill via a `.claude/skills/...` path works (it resolves through the symlink), but `git add` on that path fails with `fatal: ... is beyond a symbolic link`. When staging or committing a skill change, use the real path, e.g. `git add .agents/skills/agent-rules/SKILL.md`.

## Rules

Read and follow rules from any category whose "Read when" keywords match your current task. To add, update, or delete rules, use the `agent-rules` skill.

| Category     | Read when                                                                                                    | File                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| TypeScript   | `.ts`, `.tsx`, type, interface, switch, `any`, `as`, `satisfies`, zod, vitest `expect`, test mock, `vi.mock` | [typescript.md](agent-docs/rules/typescript.md)     |
| Comments     | comment, `//`, `/**`                                                                                         | [comments.md](agent-docs/rules/comments.md)         |
| Visual Tests | `toHaveScreenshot`, snapshot, visual regression, baseline, `regions(`, `page.mouse`, `.spec.ts`              | [visual-tests.md](agent-docs/rules/visual-tests.md) |

## Change Scope

- Keep changes incremental and narrow in scope.
- Inspect the existing implementation and any related tests before editing code.
- Push back on multiple independent features in a single change.
  - Split unrelated generator work into separate PRs.
  - Split builder changes and new-generator work into separate PRs unless the builder change is fully proven by tests first and the follow-on generator change is clearly dependent.
  - If a request mixes unrelated work, propose the smallest safe slice and leave the rest for a follow-up PR.
- Treat `src/builder` as the generator framework layer, but keep generator-authored content in `src/generators` unless the task is explicitly moving shared framework behavior.
  - Shared contracts and framework behavior can live in `src/builder`.
  - Generator-owned assets, version registries, and other content should stay under `src/generators`, typically in `_common` or the specific generator directory.

## Generator surface

- A generator (`src/generators/<name>/`) imports from exactly one place inside `src/builder`: the `@genroot/builder` barrel. It exports two runtime surfaces — `GeneratorRenderer` and `GeneratorUI` — plus the shared type vocabulary.
- **Never reach past the barrel into `src/builder` from a generator or a test** — not `@genroot/builder/ui/*`, not `@genroot/builder/engine/*`, not a relative `../../builder/*`, not a deep path like `@genroot/builder/generator`, and not type-only. Those are framework internals, not the generator authoring surface. `npm run check:imports` enforces this: it resolves every specifier to a real file and allows exactly one target inside `src/builder` — the barrel, `src/builder/index.ts`. It covers `src/generators/**` and `tests/**`; `src/generators/_common/**` is a documented carve-out (see the script's header for why). If you find yourself wanting an exception, add the export to the barrel instead.
- Every pre-built generic control is reached through `GeneratorUI` (`GeneratorUI.BooleanControl`, `GeneratorUI.LoadedTextureControl`, …), not imported directly.
- Controls that are **not** generic — anything that knows what a Minecraft skin, tint, or glint is — are generator content, not framework. They live under `src/generators/_common/` (e.g. `_common/skins/skinControl`, `_common/tintSelector`, `_common/plugins/glint`) and are deliberately absent from `GeneratorUI`.
- Copying an existing generator as a template is fine — but it is also how leaks come back, so run `npm run lint` before assuming the imports are right.

## Verification

- Use a test-driven mindset for all work.
- Build a quality gate foundation as part of the change:
  - add or update tests before or alongside the implementation
  - verify the smallest relevant test set first
  - expand to broader checks when shared behavior changes
- Run the smallest relevant verification set first, then expand to the broader checks if the change touches shared behavior.
- Verify the smallest relevant surface first, then widen coverage only as far as the behavior actually propagates.
- After each completed change slice, run `npm run types:check` and `npm run lint` once the focused tests pass.

## Visual Regressions

- When behavior can regress visually, add or extend a focused visual regression test before changing the implementation.
- Prefer the existing `testing` generator for Generator Builder features and other shared builder-level screenshot cases.
- Keep generator-specific visual regressions in the specific generator unless the behavior is genuinely shared across generators.
- Keep the testing board small and purposeful:
  - include a reference sheet or fixture page when useful
  - group common render cases together
  - add a rotation/flip matrix only when it meaningfully exercises the space
  - use density comparison pages for source-size behavior
- Use bitmap fixtures for visual tests when pixel accuracy matters; avoid text in screenshots unless the text itself is what you are testing.
- Add short code comments for board pages or other non-obvious test intent so future agents do not need to rediscover the rationale.

## Serialization

- Keep encoding and decoding logic encapsulated in the module or component that owns the data.
- Treat encoded values as opaque to unrelated components; they should use the owning module's API instead of reimplementing serialization details.
- Apply that pattern to selected texture state and similar generator payloads when they are persisted or restored.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
