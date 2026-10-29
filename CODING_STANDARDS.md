# Coding Standards

How code in this repo is written and reviewed. Tooling enforces the mechanical rules; this file holds the judgement calls a reviewer checks by reading the diff. Domain words come from [GLOSSARY.md](GLOSSARY.md), and decisions already made are in [docs/adr/](docs/adr/).

---

## 1. Enforcement

| Check      | Command                  | Configured in       |
| :--------- | :----------------------- | :------------------ |
| Lint       | `npm run lint`           | `eslint.config.mjs` |
| Types      | `npm run type`           | `tsconfig.json`     |
| Formatting | `npm run prettier:check` | Prettier defaults   |
| Tests      | `npm test`               | `vite.config.ts`    |

There is no pre-commit hook. The deploy workflow (`.github/workflows/deploy.yml`) runs all four on every push to `master` and stops before deploying if one fails, so run them before opening a PR: a failure surfaces only after merge.

---

## 2. Naming

| What                                  | Convention                                  | Example                           |
| :------------------------------------ | :------------------------------------------ | :-------------------------------- |
| Domain modules in `src/`              | `camelCase`, named after a glossary concept | `passage.ts`, `learnerHistory.ts` |
| React components and their stylesheet | `PascalCase`, the stylesheet named after it | `Keyboard.tsx`, `Keyboard.css`    |
| Shared stylesheets                    | lowercase                                   | `tokens.css`, `page.css`          |
| Tests                                 | the concept they cover, under `tests/`      | `tests/unit/weakKeys.test.ts`     |
| Functions and variables               | `camelCase`                                 | `findWeakKeys`, `typedPortion`    |
| Module-level constants                | `UPPER_SNAKE_CASE`                          | `ROW_UNITS`, `ATTEMPTS_KEY`       |
| DynamoDB attributes                   | `camelCase`                                 | `createdAt`                       |
| Branches                              | `kebab-case`                                | `mobile-warning`                  |

Name things with the glossary's terms (Test, Passage, Attempt, Weak Key, ...) and never with the words it lists under _Avoid_. A new concept gets a glossary entry in the same PR.

---

## 3. Code Design Patterns

### 3.1 Errors the learner sees

Failures that reach the learner become a plain sentence telling them what to do next. The Contact Lambda returns its validation errors as `{ error }`, and the form shows that sentence or its own fallback.

<!-- example-bad -->

```typescript
// ❌ BAD: the learner sees a status code, or nothing
const response = await fetch(ENDPOINT, { method: 'POST', body })
if (!response.ok) throw new Error(`HTTP ${response.status}`)
```

<!-- example-good -->

```typescript
// ✅ GOOD: every failure ends in a sentence the learner can act on
try {
  const response = await fetch(ENDPOINT, { method: 'POST', body })
  if (!response.ok) {
    const { error } = await response.json().catch(() => ({}))
    setStatus({ kind: 'failed', message: error ?? 'Try again in a minute.' })
  }
} catch {
  setStatus({ kind: 'failed', message: 'Check your connection and try again.' })
}
```

### 3.2 Browser storage

Learner history stays in `localStorage` ([ADR 0001](docs/adr/0001-learner-data-stays-in-the-browser.md)). Storage can be missing or blocked (private windows, blocked site data), so every read and write sits in `try`/`catch`: a read falls back to the empty value and a failed write is dropped, and the page keeps working either way.

### 3.3 Async work

Every promise is awaited inside a `try`/`catch` that handles its failure, as in 3.1. When work genuinely runs in the background, its rejection still gets a handler:

```typescript
// ✅ GOOD: backgrounded, and its failure is still handled
startBackgroundJob().catch((error) => reportFailure(error))
```

### 3.4 Design values

Colours, font sizes, spacing, radii and shadows come from the tokens in `src/tokens.css`. A new value goes into `tokens.css` and the [design system](https://claude.ai/artifact/DePUGvPge9wRPzhCdsvSUG) in the same change.

---

## 4. Tests

Write the failing test first, watch it fail for the expected reason, then write only the code that makes it pass. Refactoring happens in review, once the tests are green.

```bash
npx vitest        # watch mode while working
npm test          # one full run, as CI does
```

- Test through a module's exports (`tests/unit/`) or by driving a page as a learner would (`tests/integration/`), never through private functions.
- Expected values are literals or worked examples, never recomputed the way the code computes them.
- A test that would still pass with the change reverted proves nothing; break the change on purpose and confirm a test fails.

---

## 5. Evidence for UI Changes

- **Pure moves and refactors:** a pixel comparison against the live site shows nothing changed. That proves _unchanged_, not _correct_.
- **New or changed behaviour:** show the new behaviour working, in screenshots or a test.
- **Mobile changes:** an emulator doesn't bounce on overscroll, show Safari's toolbar or open an on-screen keyboard. Say in the PR what was checked only in emulation, and check it on a real phone before merging.

---

## 6. Git & Review Workflow

### Commit messages

A short imperative sentence in the glossary's terms, with a body explaining _why_ when it isn't obvious:

- `Warn on phones and tablets that a Test needs a keyboard`
- `Move tests to tests/, named by concept`
- `Pin deploy-role.sh to us-east-1, like deploy.sh`

### Pull request checklist

- [ ] All four checks in section 1 pass locally.
- [ ] The PR body shows evidence that matches section 5.
- [ ] A change that adds an AWS resource type comes with its permissions in `infra/github-deploy-role.yaml`, applied by hand with `scripts/deploy-role.sh` before merging ([ADR 0003](docs/adr/0003-deploy-from-github-actions.md)).
