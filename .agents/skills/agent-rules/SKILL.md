---
name: agent-rules
description: Use when the user wants to add, update, or delete a persistent rule about how work should be done.
---

# Agent Rules

## Storage

- Rules live at `agent-docs/rules/<category>.md`, indexed by a table in `AGENTS.md`. A category file holds one or more `##` rules sharing the same _Read when_ trigger.
- Save to the repo's root `AGENTS.md` — paired with `CLAUDE.md`, which just references it via `@AGENTS.md`.
- Update a rule by editing its existing `##` section in place — never duplicate.
- If a category file becomes empty after a delete, remove the file and its row.
- _Read when_ keywords trigger the rule — pick what an agent encounters while doing the work (file extensions, library names, identifiers), not restatements of the category.

## Rule format

A rule is a single `##` section with exactly three parts — no `**How to apply:**` or other bold sub-sections; concrete steps go in the body:

1. **`##` heading** — directive, imperative form.
2. **Body** — one or two sentences naming the commands, files, types, or patterns to act on, in workflow-neutral language (avoid PR/commit/review scoping; rules apply during implementation, review, and audit). Inline detection signals (grep patterns, globs, type names) here.
3. **`**Why:**`** — the mechanism or failure mode the rule prevents, not a restatement of the directive. Forward-looking — what helps an agent judge edge cases. No incident narratives (PR numbers, dates); that history belongs in the rule's commit message. The Why is normally one or two sentences. It may run longer when an agent would otherwise make the wrong call — e.g. a counterintuitive API where the safe-looking alternative fails in a non-obvious way. Test each extra sentence: if an agent would act identically without it, cut it. Explaining why the obvious workaround is also wrong counts; restating the directive or narrating history does not.

Keep rules minimal — every line ships in every prompt that loads the rule, so a line earns its place only if it changes what an agent does. Prefer the shortest rule that still lets an agent **act and judge edge cases correctly** — not the shortest rule.

## Quality criteria

Write each rule so an unfamiliar agent can:

- **Recognize when it applies** from the directive and _Read when_ keywords alone.
- **Act on it immediately** — no _"go figure out what X is."_
- **Judge edge cases** from the Why's mechanism, not history. A rule covering counterintuitive behaviour may spend extra Why lines on the mechanism that drives those edge cases, but each line must be load-bearing — remove it and an agent should make a worse decision.
- **Trust the detection signal** — a signal must distinguish a real violation from legitimate uses of the same construct; if it would also flag valid code, narrow it (qualify the pattern, or name the condition that makes it a violation). Judge the signal together with the prose that scopes it: a qualifying condition stated in the body (the surrounding context, the kind of value, who owns the shape) counts as narrowing even if the bare pattern would also match valid code. Naming that condition is sufficient — a grep-tight pattern is not required, and is often impossible for judgment-based rules.
- **Apply it while producing the work, and self-check the result** — a rule must be actionable by the agent doing the work, not only a reviewer after the fact; where possible express it as a check the agent can run against its own output before finishing — a command, an inspection, or a static pattern.

Tighten any criterion that fails.

## Example

`AGENTS.md`:

```markdown
## Rules

Read and follow rules from any category whose "Read when" keywords match your current task. To add, update, or delete rules, use the `agent-rules` skill.

| Category   | Read when                                     | File                                            |
| ---------- | --------------------------------------------- | ----------------------------------------------- |
| Migrations | d1, database schema, migration, `wrangler d1` | [migrations.md](agent-docs/rules/migrations.md) |
```

`agent-docs/rules/migrations.md`:

```markdown
# Migrations

## Number D1 migration files with a zero-padded sequence prefix

Name each migration `NNNN_description.sql` with a zero-padded, monotonically increasing prefix (`0001_`, `0002_`).

**Why:** `wrangler d1 migrations apply` runs files in lexical order, so an unpadded prefix sorts `10` before `2` and applies schema changes out of order.
```
