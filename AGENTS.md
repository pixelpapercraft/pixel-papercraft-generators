# Project Context

This project is a papercraft template generator focused mainly on Minecraft-inspired designs.

It includes many generators that turn characters, creatures, items, and other game-themed subjects into printable paper templates. Many of these generators let a player use their own Minecraft skin to create unusual variants of themselves, such as creeper-themed or cow-themed versions.

# Agent Rules

## Tools

- Always use the `gh` command for GitHub operations.
- After creating a new git worktree for this repo, run `npm install` and then `npm run setup` in the new worktree before running checks or making changes.

## Skills

- Skills live at `.agents/skills/<skill-name>/SKILL.md` — that's the real, git-tracked location. Claude Code doesn't look there by default, so `.claude/skills` is a symlink to `../.agents/skills` to make them discoverable.
- Editing a skill via a `.claude/skills/...` path works (it resolves through the symlink), but `git add` on that path fails with `fatal: ... is beyond a symbolic link`. When staging or committing a skill change, use the real path, e.g. `git add .agents/skills/agent-rules/SKILL.md`.

## Rules

Read and follow rules from any category whose "Read when" keywords match your current task. To add, update, or delete rules, use the `agent-rules` skill.

| Category   | Read when                                                                     | File                                                |
| ---------- | ------------------------------------------------------------------------------ | ---------------------------------------------------- |
| TypeScript | `.ts`, `.tsx`, type, interface, switch, `any`, `as`, `satisfies`, zod, vitest `expect`, test mock | [typescript.md](agent-docs/rules/typescript.md) |

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

## V2 generator surface

- A V2 generator (`src/generators/*V2/`) imports from exactly one place inside `src/builder`: the `@genroot/builder/v2` barrel. It exports two runtime surfaces — `GeneratorRenderer` and `GeneratorUI` — plus the shared type vocabulary.
- **Never import `@genroot/builder/ui/*` or `@genroot/builder/modules/*` from a V2 generator**, including type-only imports. Those are v1's and are being retired once every generator is migrated. An eslint rule enforces this; if you find yourself wanting to add an exception, add the export to the barrel instead.
- Every pre-built generic control is reached through `GeneratorUI` (`GeneratorUI.BooleanControl`, `GeneratorUI.LoadedTextureControl`, …), not imported directly.
- Controls that are **not** generic — anything that knows what a Minecraft skin, tint, or glint is — are generator content, not framework. They live under `src/generators/_common/` (e.g. `_common/skins/skinControl`, `_common/tintSelector`, `_common/plugins/glint`) and are deliberately absent from `GeneratorUI`.
- When migrating a generator to V2, copying an existing V2 generator as a template is fine — but it is also how leaks come back, so run `npm run lint` before assuming the imports are right.

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
