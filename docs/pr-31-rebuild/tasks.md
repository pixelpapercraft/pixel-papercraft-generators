# PR 31 Rebuild Notes

Working reference:

- A separate reference worktree was checked out at `/Users/kevanstannard/dev/pixel-papercraft-generators-pr-31-rebuild`
- The reference worktree is at PR 31 head commit `9212a25337f115fb4b1ad8d31c9fa25bcf70d462`
- `npm install` and `npm run setup` were run successfully in that reference worktree
- Do not mark any task as done unless the user explicitly approves that slice.

## Current State

- Main working branch: `pr-31-rebuild`
- Reference worktree: `/Users/kevanstannard/dev/pixel-papercraft-generators-pr-31-rebuild`
- Reference branch in that worktree: `pr-31-reference`
- Reference commit: `9212a25337f115fb4b1ad8d31c9fa25bcf70d462`
- Reference worktree setup is complete: `npm install` and `npm run setup` were both run there successfully

## Work Checklist

14. [x] Review the remaining PR 31 UI divergences
  - Includes the picker preview tint/background behavior, the block orientation snapshots, and the item custom-scale / overlay snapshot deltas that still differ between PR 31 and this branch.
  - Depends on the rebuilt picker, item, and block flows already landed.
  - This is a reconciliation and merge-planning slice, not a framework refactor.
  - Verification: compare the current screenshots against the PR 31 reference worktree, rerun the affected Playwright specs, and document whether each delta is intentional or a regression.
  - Completed and approved after the final review confirmed there are no remaining items to work on for this reconstruction.

### Suggested order

1. No remaining tasks.

The reconstruction checklist is complete.
