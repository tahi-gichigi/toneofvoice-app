# Claude Code Instructions

---

## Before You Start

1. Read the project spec / README
2. Check `tasks/lessons.md` - mistakes to avoid repeating
3. Check recent commits - what changed

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Minimal code impact.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Only touch what's necessary. Don't introduce new surface area.
- **Honest Uncertainty**: If you don't know, say so. Don't fabricate confidence.
- **Scope Discipline**: When a bug fix or feature expands unexpectedly, flag it - don't silently absorb it.

---

## Communication Style

- **Low verbosity always** - Keep responses short and concise. Never write long explanations.
- **Plain English**: Short, casual sentences. No jargon.
- **Be direct**: Tell the truth. Admit when you don't know. Suggest solutions.
- **Be critical**: Push back when an implementation is weak, a flow is confusing, or a shortcut will cause problems later.
- **Complete, then report**: Deliver the finished thing with a short summary, not a running commentary.

---

## Agentic Working Style

### Planning
- Enter plan mode for ANY non-trivial task (3+ steps, touches 2+ files, or involves architectural decisions)
- Write detailed specs upfront - but if requirements are unclear, clarify before planning (see Decision Gateway)
- Write plan to `tasks/todo.md` with checkable items; mark complete as you go
- Frame the full feature, not the first step - scaffold and connect all files needed end-to-end
- If something goes sideways mid-execution: STOP, re-plan, surface the issue - don't keep pushing

### Execution
- Don't stop mid-task to ask permission or confirm small decisions - make reasonable choices and keep going
- Use success criteria as your finish line: if the task includes "Done when:", run until every criterion is met
- Fix failing CI tests without being told how
- If genuinely blocked (missing secret, broken auth, external dependency) - state exactly what you need and why you can't proceed

### Verification
- Never mark a task complete without proving it works
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness
- If you can't verify, say so explicitly - don't silently mark done

### Elegance
- For non-trivial changes (2+ files or new patterns): pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious, single-file fixes - don't over-engineer

### Bug Fixing
- When given a bug report with clear scope: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- If the fix requires changing the approach significantly, surface this before proceeding

### Subagents
- Use subagents to keep the main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One task per subagent for focused execution

---

## Decision Gateway

When uncertain whether to proceed or ask:

| Situation | Action |
|---|---|
| Requirements are ambiguous or contradictory | Ask ONE focused clarifying question, then proceed |
| You've hit an unexpected blocker mid-task | Stop, describe what you found, propose options |
| The task is clear but complex | Plan autonomously, proceed |
| You're >30% into a task and realize the approach is wrong | Stop immediately, re-plan, surface to user |
| A bug fix requires changing more than originally scoped | Flag the expanded scope before continuing |

**Default rule:** Attempt the task. Surface blockers early. Don't ask for permission to do the obvious.

If not given success criteria, state your assumed "Done when:" in one sentence and proceed.

---

## Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Review `tasks/lessons.md` at the start of each session

---

## Writing Style

- **UI/User-facing copy**: Never use em dash (—). Use hyphen (-) or rewrite.
- **Code comments**: Explain the why, not the what
- **Error messages**: Clear and specific for users
- **Agent prompts**: Single lead sentence → short bullets

---

## Build & Deploy

- **Always use `pnpm`** not `npm`
- Don't auto-run builds after fixes unless it's a big refactor
- Run `pnpm test` before committing

---

## Code Quality

- TypeScript strictly - explicit types over `any`
- Handle errors gracefully with clear user messages
- Update tests when changing logic
- Never commit API keys or secrets
- Sanitize user inputs, validate server-side
- Use documented APIs and official SDKs - don't roll your own when a library exists

---

## Best Practices

**UX & Product**
- User flows should be obvious - if a user has to think, simplify
- Error states, empty states, and loading states are part of the feature - not afterthoughts
- Microcopy matters: labels, placeholders, CTAs, and tooltips should be specific and action-oriented
- Confirm destructive actions; use optimistic UI for non-destructive ones

**UI & Responsive Design**
- Mobile-first. Test every layout at 375px, 768px, and 1280px
- Touch targets minimum 44px
- Don't use fixed pixel widths for containers - use `max-w-*` with full width defaults

**Backend & Data**
- Validate at the boundary (API route), not just the client
- Keep DB queries out of components - go through a service/lib layer
- Never expose internal error details to the client

**Security**
- Never commit secrets - use `.env.local` or equivalent (gitignored)
- Always verify user session server-side before any DB write
- Don't trust client-sent user IDs - always derive from session

---

## Commit Conventions

Commits are a permanent record - write them for someone reading the history in 6 months.

```
type(scope): subject

- What changed and why (not just what)
- Note any trade-offs or decisions made

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`

Always push after completing a feature or fix so work is never lost locally.

---

**Last Updated:** 2026-02-22
