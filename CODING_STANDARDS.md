# Coding Standards & Architecture Guidelines

This document outlines the mandatory technical stack, naming conventions, pattern enforcement, and workflows for this repository. Adherence ensures determinism, quality, and strict type safety.

---

## 1. Technical Stack & Enforcement Hierarchy

Our project enforces alignment via layered validation tiers. Do not attempt to bypass these checks.

* **Tier 1 (Deterministic Scanners):** ESLint / Biome / Prettier configuration files.
* **Tier 2 (Pre-commit Hooks):** Husky scripts executing `npm run verify`.
* **Tier 3 (AI/Human Review):** Rigid validation against this specification.
* **Tier 4 (Advisory Prose):** Contextual documentation.

---

## 2. Naming Conventions

Strict casing constraints must be applied uniformly across the entire filesystem and code architecture:

| Artifact | Convention | Example |
| :--- | :--- | :--- |
| **Files, APIs, & Git Branches** | `kebab-case` | `user-profile.ts`, `feature/auth-refresh` |
| **Components, Classes, & Types**| `PascalCase` | `UserProfileCard`, `ValidationError` |
| **Functions, Methods, & Variables**| `camelCase` | `fetchUserData()`, `isAuthorized` |
| **Constants & Environment Vars** | `UPPER_SNAKE_CASE` | `MAX_RETRY_ATTEMPTS`, `DATABASE_URL` |
| **Database Tables & Columns**   | `snake_case` | `user_accounts`, `created_at` |

---

## 3. Code Design Patterns (Show, Don't Tell)

### 3.1 Error Handling
Fail early, fail hard, and return domain-specific classes. Never rely on generic error messages.

<!-- example-bad -->
```typescript
// ❌ BAD: Catching generic errors or returning untyped strings
try {
  const user = await db.fetch(id);
  if (!user) return "Not found";
} catch (e) {
  console.log(e);
}
```

<!-- example-good -->
```typescript
//  GOOD: Using domain-specific error classes and structured handling
try {
  const user = await db.fetch(id);
  if (!user) {
    throw new NotFoundError(`User with ID ${id} does not exist.`);
  }
  return user;
} catch (error) {
  logger.error({ error, userId: id }, "Failed to retrieve user profile");
  throw error;
}
```

### 3.2 Asynchronous Control Flow
Always handle async boundaries explicitly. Avoid floating promises unless explicitly tracking them with `void`.

<!-- example-bad -->
```typescript
// ❌ BAD: Floating promise with ignored failure paths
function init() {
  saveMetrics(); // No await, unhandled rejection risk
}
```

<!-- example-good -->
```typescript
//  GOOD: Awaiting asynchronously or using void to indicate intent
async function init(): Promise<void> {
  try {
    await saveMetrics();
  } catch (error) {
    trackFailure(error);
  }
}

// Or explicitly void if intentionally backgrounded:
void fireAndForgetBackgroundJob();
```

---

## 4. Test-Driven Development (TDD) Loop

TDD is mandatory for all modifications, including business logic updates and core utility enhancements.

1. **Write a Failing Test:** Draft a deterministic unit or behavior-driven test.
2. **Verify Failure:** Run the test suite to confirm the exact failure reason.
3. **Write Minimal Code:** Implement only the necessary adjustments to satisfy the test.
4. **Refactor Safely:** Optimize code readability and architecture while keeping tests green.

```bash
# Execute local test suite verification loop
npm run test:watch
```

---

## 5. Git & Review Workflow

### Commit Messages
We adhere strictly to the **Conventional Commits** specification: `<type>(<optional scope>): <description>`

* `feat(auth):` Implement JSON Web Token (JWT) rotation mechanisms.
* `fix(ui):` Correct race condition rendering user avatars on slower viewports.
* `docs(api):` Clear up ambiguity on pagination boundaries within the endpoints.

### Pull Request Checklist
Before requesting review, ensure your branch passes validation:
- [ ] No compilation warnings or typescript linting issues.
- [ ] Coverage metrics remain at or above project threshold (85%).
- [ ] Code modifications do not overfetch fields or data layers.