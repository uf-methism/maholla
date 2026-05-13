# Mohalla — AI Collaboration Guide

> **For Team Strawhats.** Read this before your first AI coding session.

## Why This Guide Exists

You're a 2-person team where **both** of you use AI coding agents (Antigravity, Claude, Gemini, Cursor). AI agents are incredibly productive but also incredibly dangerous in a shared repo — they don't know what the other person's AI just changed. Without guardrails:

- Two AIs edit the same file → **merge conflict nightmare**
- One AI "helpfully" refactors code it doesn't own → **breaks the other person's work**
- Both AIs modify shared types independently → **integration breaks at demo time**

This guide prevents all of that.

---

## The Ownership Model

The single most important rule: **each directory has ONE owner.**

| Directory | Owner | What Lives Here |
|---|---|---|
| `backend/` | **Member A** | Express API, database, middleware |
| `ai-services/` | **Member A** | Whisper + Claude integration modules |
| `apps/vendor/` | **Member B** | React Native vendor app |
| `apps/customer-pwa/` | **Member B** | Next.js customer PWA |
| `packages/shared-types/` | **Both** | API contracts (coordinated changes only) |
| Root configs | **Both** | package.json, .gitignore, AGENTS.md |

**What "owner" means:**
- Only your AI agent touches files in your directories
- If you need something from the other person's domain, **talk to them** — don't have your AI reach in
- If your AI tries to edit outside your zone, **stop it** and redirect

---

## Git Branching Strategy

```
main (protected — no direct pushes)
  ├── feat/member-a/vendor-crud-api
  ├── feat/member-a/whisper-integration
  ├── feat/member-b/onboarding-screen
  ├── feat/member-b/discovery-map
  └── chore/shared-types/add-order-status
```

### Branch Naming

```
feat/<owner>/<short-description>    → New feature
fix/<owner>/<short-description>     → Bug fix
chore/<owner>/<short-description>   → Config, deps, cleanup
chore/shared-types/<description>    → Changes to shared types (special)
```

### Commit Format (Conventional Commits)

```
feat(backend): add vendor CRUD endpoints
fix(vendor-app): resolve OTP input crash on Android
chore(shared-types): add Order status enum
docs: update AI guide with new rules
```

### PR Workflow

1. Create a branch from latest `main`
2. Do your work (with AI agents)
3. Push branch, open PR on GitHub
4. **The other team member reviews and approves**
5. Squash merge to `main`
6. Delete the branch

---

## Before Starting an AI Coding Session

Run through this checklist **every time** before you start working with your AI:

- [ ] `git pull origin main` — get latest changes
- [ ] `git checkout -b feat/<your-name>/<feature>` — create a feature branch
- [ ] Tell your AI: *"I am Member [A/B]. I own [backend + ai-services / vendor app + customer PWA]. Do not touch files outside my directories."*
- [ ] Open only files in YOUR directories to keep AI context focused
- [ ] Check that the AI read `AGENTS.md` (most tools do this automatically)

---

## How to Talk to Your AI Agent

### Good Prompts (Scoped)

> "Create a new Express route in `backend/src/routes/vendors.ts` for GET /api/vendors/:id"

> "Add a new screen in `apps/vendor/app/inventory.tsx` that shows the product list"

### Bad Prompts (Dangerous)

> ❌ "Refactor the project to use a better folder structure"
> *This will touch EVERYTHING across all directories*

> ❌ "Update the Order type to include a new field"
> *This modifies shared-types, which needs coordination*

> ❌ "Fix all the TypeScript errors in the project"
> *This will reach into the other person's code*

### Redirecting Your AI

If your AI starts editing files outside your zone:

> "STOP. Do not modify files in `backend/`. I only own `apps/`. Revert any changes you made outside my directories."

---

## The Shared Types Workflow

`packages/shared-types/` is the **only** place both team members' code overlaps. Handle with care:

1. **Discuss the change** on WhatsApp/call before touching it
2. **One person makes the change** on a `chore/shared-types/` branch
3. **Both review the PR** before merging
4. **Both update their code** to match the new types

**Never** have your AI modify shared types as part of a larger feature branch. Always isolate type changes.

---

## Emergency Recovery

### "My AI made a mess"

```bash
# See what the AI changed
git diff

# Undo ALL uncommitted changes
git checkout .

# Undo changes to a specific file
git checkout -- path/to/file.ts

# Already committed? Undo last commit but keep changes
git reset --soft HEAD~1

# Nuclear option: go back to main
git checkout main
```

### "We have a merge conflict"

```bash
# On your feature branch
git fetch origin
git rebase origin/main

# Fix conflicts in your editor (not with AI — do this manually)
git add .
git rebase --continue
```

### "The AI deleted something important"

```bash
# Find the file in git history
git log --all --full-history -- path/to/deleted/file.ts

# Restore it from a specific commit
git checkout <commit-hash> -- path/to/deleted/file.ts
```

---

## Quick Reference Card

| Situation | Action |
|---|---|
| Starting work | `git pull origin main`, create feature branch |
| AI editing wrong files | Stop it immediately, redirect to your directories |
| Need a shared type change | Talk to teammate first, use `chore/shared-types/` branch |
| Done with feature | Push, open PR, wait for teammate review |
| AI made a mess | `git diff` to see damage, `git checkout .` to undo |
| Merge conflict | `git rebase origin/main`, fix manually |
| Other person merged a PR | `git pull origin main`, rebase your branch |
