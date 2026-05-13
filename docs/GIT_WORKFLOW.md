# Mohalla — Git Workflow

> Team Strawhats · 2-person team with AI agents

## Branch Strategy

```
main ← protected, always deployable
  └── feature branches ← all work happens here
```

**No one pushes directly to `main`. Ever. Not you, not your AI.**

## Branch Naming

```
feat/<owner>/<description>       → feat/vishal/vendor-crud-api
fix/<owner>/<description>        → fix/vishal/onboarding-crash
chore/<owner>/<description>      → chore/vishal/add-eslint
chore/shared-types/<description> → chore/shared-types/add-order-status
```

## Commit Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

Types: feat, fix, chore, docs, refactor, test, style
Scopes: backend, vendor-app, customer-pwa, ai-services, shared-types
```

**Examples:**
```
feat(backend): add POST /api/vendors endpoint
fix(vendor-app): fix voice recording crash on Android 12
chore(shared-types): add DeliveryPreference type
docs: add setup instructions to README
refactor(backend): extract auth middleware to separate file
```

## PR Workflow

```
1. git checkout main
2. git pull origin main
3. git checkout -b feat/<your-name>/<feature>
4. ... do your work ...
5. git add .
6. git commit -m "feat(scope): description"
7. git push origin feat/<your-name>/<feature>
8. Open PR on GitHub
9. Other team member reviews
10. Squash merge to main
11. Delete branch
```

## PR Template

When opening a PR, include:

```markdown
## What
Brief description of what this PR does.

## Why
Why this change is needed.

## Directories Modified
- [ ] backend/
- [ ] ai-services/
- [ ] apps/vendor/
- [ ] apps/customer-pwa/
- [ ] packages/shared-types/

## Testing
How you tested this change.

## Screenshots (if UI)
```

## Staying in Sync

**Before starting work each day:**
```bash
git checkout main
git pull origin main
git checkout -b feat/<your-name>/<todays-feature>
```

**If main was updated while you were working:**
```bash
git fetch origin
git rebase origin/main
# fix any conflicts
git push --force-with-lease
```

## Protected Files

These files should rarely change and never without discussion:
- `AGENTS.md` (root)
- `CLAUDE.md`
- `.cursorrules`
- `packages/shared-types/src/index.ts`
- `package.json` (root)
