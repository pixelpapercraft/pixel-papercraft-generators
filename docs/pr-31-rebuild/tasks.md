# PR 31 Rebuild Notes

Working reference:

- A separate reference worktree was checked out at `/Users/kevanstannard/dev/pixel-papercraft-generators-pr-31-rebuild`
- The reference worktree is at PR 31 head commit `9212a25337f115fb4b1ad8d31c9fa25bcf70d462`
- `npm install` and `npm run setup` were run successfully in that reference worktree
- Do not mark any task as done unless the user explicitly approves that slice.

What we have confirmed so far:

- The local equivalent of `src/builder/modules/textureData.ts` is `src/generators/_common/textureData.ts`
- The PR version is not a straight rename of the local file
- The PR version changes the texture data model substantially:
  - `TextureData_TileFrame` changes from `{ x, y, width, height }` to `{ rectangle, crop }`
  - `TextureData_Tile` drops positional and size fields and keeps `name` plus `frames`
  - `TextureFrame` changes from `{ id, name, rectangle, frameIndex, frameCount }` to `{ id, label, rectangle, crop }`
  - the PR adds sorting logic for texture tiles
  - the PR adds `imageToTextureFrames()`
  - the PR changes label generation and strips image extensions from labels

Notes:

- There are older PR 31 notes in `docs/` from a previous iteration of this work, but they are stale and should not be used as a source of truth for this reconstruction.

## Current State

- Main working branch: `pr-31-rebuild`
- Reference worktree: `/Users/kevanstannard/dev/pixel-papercraft-generators-pr-31-rebuild`
- Reference branch in that worktree: `pr-31-reference`
- Reference commit: `9212a25337f115fb4b1ad8d31c9fa25bcf70d462`
- Reference worktree setup is complete: `npm install` and `npm run setup` were both run there successfully
- This document is the current source of truth for the reconstruction plan; older PR 31 docs are stale

## Current Findings

### Handoff Summary

- Task 1 is complete and approved.
- Task 2 is complete and approved.
- Task 3 is complete and approved.
- Task 4 is complete and approved.
- Task 5 is complete and approved.
- Task 6 is the next slice to work on in the next session.
- Keep the `Do Not Commit` rule in place for every task until you explicitly approve the slice.
- Keep the builder-framework versus generator-content boundary in mind:
  - `src/builder` owns shared framework behavior.
  - `src/generators/_common/textures` owns tiled texture assets and version registries.
  - ordinary non-tiled generator assets stay in their generator directories.

### Handover Procedure

- When a slice is complete, mark the matching checklist item as done before handing over.
- Append a short entry to `docs/pr-31-rebuild/logs.md` for the session before handing over.
- Save the minimal context needed to resume cleanly: the completed task number, the next task number, the verification status, and any open follow-up notes.
- Leave the next-session entry point explicit so a resume prompt like `Let's continue working on the tasks in docs/pr-31-rebuild/tasks.md` can pick up immediately.
- If the slice introduced a follow-up that belongs to a later task, note that separately rather than leaving the current task ambiguous.
- Assume incoming code may contain bugs, even when it resembles the reference; validate rigorously and do not treat parity as proof of correctness.

### Ownership Boundary

- Treat `src/builder` as the generator framework layer.
- Keep the tiled texture contract and atlas-packing logic in `src/builder` when it is part of the shared framework API.
- Keep generator-authored tiled texture assets and version registries in `src/generators/_common/textures`.
- Keep ordinary non-tiled generator images and skin textures inside their generator directories.
- Do not move generator content into `src/builder`; only shared framework behavior belongs there.

## Work Checklist

### Independent slices

1. [x] Rebuild the shared texture data and packing foundation in `src/builder/modules/textureData.ts` and `src/builder/modules/texturePacking.ts`
  - Includes the new `rectangle`/`crop` texture frame model, tile sorting, image-to-frame conversion, and atlas packing behavior.
  - Framework-only slice: do not move generator-authored texture assets or version registries into `src/builder`.
  - Depends on nothing else in this PR.
  - Blocks most of the other texture work.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

2. [x] Reorganize generated texture assets and the texture-version registry into `src/generators/_common/textures`
  - Includes the new generated `texture_*.ts` files, the moved PNG fixtures, `customTextureVersion`, and the shared `textureVersions` registry.
  - Depends on the shared texture data foundation above.
  - Blocks the shared picker wrapper and every generator that reads texture versions.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.
  - Next session start point: begin with task 3 after task 2 is complete and approved.

3. [x] Rebuild the shared texture picker primitives in `src/builder/ui/texturePicker`
  - Includes `rotation.ts`, `flip.ts`, `selectedTexture.ts`, and the new picker UI.
  - Depends on the shared texture frame model and on the shared texture-version registry.
  - Blocks the block/item picker integrations and the new serialized selected-texture format.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.
  - Next session start point: begin with task 4 after task 3 is complete and approved.

4. [x] Rebuild the shared glint control plumbing in `src/generators/_common/plugins/glint`
  - Includes the shared glint texture defs, shared control inputs, and shared plugin creation.
  - Depends on the existing generator/plugin infrastructure, but not on the texture picker work.
  - Can be tackled in parallel with the texture foundation work.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.
  - Completed in this session; resume with task 6 next time.

5. [x] Apply the general builder UI polish
  - Includes button sizing/style changes, page action layout changes, and the move to the shared PDF button placement.
  - Depends on no texture work.
  - Can be done independently, but should be checked against the updated picker and page flows.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

### Dependent slices

6. [x] Migrate the atlas upload/control flow to the new texture model
  - Includes `src/builder/ui/controls/atlasControl.tsx`, `textureUpload.ts`, and the atlas-related tests.
  - Depends on the shared texture data and packing foundation.
  - Also depends on the new crop-aware frame model because the atlas now preserves frame crops.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

7. [ ] Migrate the block generator to the shared picker and shared texture registry
  - Includes `minecraftBlockGenerator.tsx`, `face.ts`, and the block-specific texture/version cleanup.
  - Depends on the shared texture picker primitives, the shared texture-version registry, and the shared glint plumbing.
  - Also depends on the new selected-texture serialization format.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

8. [ ] Migrate the item generator to the shared picker and the new item layout logic
  - Includes `minecraftItemGenerator.tsx`, `itemLayout.ts`, and the new item-specific tests.
  - Depends on the shared texture picker primitives, the shared texture-version registry, and the shared texture data model.
  - Also depends on the new crop-aware frame model, because the item layout uses crop bounds instead of raw frame bounds.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

9. [ ] Migrate the armor and horse generators onto the shared glint controls
  - Includes the generator changes that remove their local glint input code.
  - Depends on the shared glint plumbing.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

10. [ ] Update the remaining generators and state consumers to the new `SelectedTexture` shape
  - Includes any code that used `SelectedTextureWithBlend` or the old encode/decode helpers.
  - Depends on the shared picker primitives and the new serialization format.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

10a. [ ] Investigate custom texture identity collisions when switching between uploaded texture sets
  - Includes the image generator and item generator flows where existing placed items disappear after swapping one custom upload set for another.
  - Suspected cause: reused tile/frame indices across different custom atlas sets causing stale item references to resolve to the wrong or missing frame.
  - Do not fix in this slice; capture the failure mode first and then decide whether the identity or serialization model needs to change.
  - Verification: reproduce the issue manually in the UI and add a focused test or note that pins down the collision behavior.
  - Do Not Commit: keep this investigation uncommitted until it has been reviewed and explicitly approved.

11. [ ] Rebuild the texture generation tooling in `src/tools/makeTextures`
  - Includes the new packing workflow, crop detection, generated TypeScript output, and output-directory move.
  - Depends on the shared texture data and packing foundation.
  - Also depends on the new texture asset layout under `src/generators/_common/textures`.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless the user explicitly approves the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

12. [ ] Finish the test and snapshot migration
  - Includes the new Vitest config, updated unit tests, and the screenshot/snapshot refreshes.
  - Depends on the features it covers being implemented first.
  - This is the final validation layer, not a first-step task.
  - Verification: run `npm run test:generators` on the full suite before handing off.
  - Do not mark this task done unless you explicitly approve the slice.
  - Do Not Commit: keep this slice uncommitted until it has been reviewed and explicitly approved.

### Suggested order

1. Shared texture data and packing foundation.
2. Shared texture assets and texture-version registry.
3. Shared picker primitives.
4. Shared glint plumbing.
5. Atlas upload/control migration.
6. Block generator migration.
7. Item generator migration.
8. Armor and horse glint migration.
9. Remaining state consumer cleanup.
10. Texture generation tooling.
11. Tests, snapshots, and final cleanup.

Prefer the earliest tasks that can be pinned down with focused unit tests before moving into broader UI or snapshot-heavy work.

### Working approach

- Work one task at a time.
- Treat incoming code as a hypothesis, not truth.
- Compare against the reference, but do not assume textual similarity means correctness.
- Prove behavior from first principles where possible, especially for stateful or ambiguous logic.
- Prefer exhaustive or adversarial tests over example-based tests when multiple valid-looking states exist.
- Use main only as a baseline for existing behavior, then check whether incoming logic changes semantics intentionally or accidentally.
- Validate each slice with focused tests, then typecheck, lint, and selective generator/image tests when rendered output can change.
- Start each task by writing or updating the smallest focused test that describes the intended behavior.
- Treat test failures as the default signal that the implementation or the expectation is wrong.
- If the current behavior is actually correct, adjust the test to match the real contract instead of forcing a regression.
- Review the existing tests with an adversarial mindset before migrating consumers, and add coverage where the current tests leave a gap.
- Make the smallest code or test change that resolves the mismatch.
- Rerun the focused test set before widening to surrounding coverage.
- After each completed slice, run `npm run types:check` and `npm run lint` once the focused tests pass.
- Also run `npm run test:generators` when the change can affect rendered output, but keep it selective and only target the relevant generator tests for the slice.
- Add more visual regression tests when a change can regress appearance; use them to narrow the blast radius before broader snapshot refreshes.
- Each slice must leave the project in a working state.
- Do not commit any changes for a slice until the slice has been reviewed and explicitly approved.
- Only mark a task as done after you explicitly approve the slice.
