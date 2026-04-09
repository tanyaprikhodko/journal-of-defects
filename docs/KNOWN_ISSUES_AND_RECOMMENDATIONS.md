# Known Issues and Recommendations

This list is based on current source code behavior and focuses on reliability and maintainability.

## High priority

### 1) Token refresh on app startup is disabled
Location: `src/main.tsx`

The refresh call is commented out. If a stored access token is expired when the app loads, the first protected API call can fail before session recovery.

Recommendation:
- re-enable startup refresh or implement a guarded bootstrap check before rendering protected routes

### 2) Route auth guard checks only token presence
Location: `src/AppRouter.tsx`

Current private route logic only checks that `accessToken` exists, not whether it is valid.

Recommendation:
- validate token expiration before treating user as authenticated
- fallback to refresh flow when token is expired but refresh token exists

### 3) Role checks are hardcoded strings across pages
Locations:
- `src/containers/MainView.tsx`
- `src/containers/CreatePage.tsx`
- `src/containers/EditPage.tsx`

Role gates are brittle because they rely on repeated string literals.

Recommendation:
- centralize role constants and permission helpers
- use those helpers in all page-level guards

## Medium priority

### 4) Create action permission check likely incorrect
Location: `src/containers/MainView.tsx`

`isCreateDisabled` currently returns disabled when role does not include dispatcher OR does not include senior dispatcher. With OR logic, most users will be disabled unless they match both.

Recommendation:
- confirm intended policy and change to AND if either role should permit create

### 5) Duplicate form logic between create and edit pages
Locations:
- `src/containers/CreatePage.tsx`
- `src/containers/EditPage.tsx`

Both pages maintain overlapping field mapping and conversion rules.

Recommendation:
- extract shared form component and payload mapper utilities

### 6) Error parsing assumes JSON error body
Locations:
- multiple methods in `src/store-auth.ts` and `src/store-zustand.ts`

Code frequently runs `await response.json()` on non-ok responses without checking content type.

Recommendation:
- add safe response parser with fallback to `response.text()`

### 7) Potential inconsistency in substation region id typing
Locations:
- `src/types/table.ts`
- `src/types/store.ts`
- page/container conversion logic

`substationRegionId` appears as string in some places and number conversion is applied in others.

Recommendation:
- standardize to one type across interfaces and payload mapping

## Lower priority

### 8) Legacy or unused shell component
Location: `src/App.tsx`

This component is not used by `src/main.tsx` (router is mounted directly) and contains a red-background layout.

Recommendation:
- remove dead file or repurpose as true app shell

### 9) Missing explicit loading/error state model for some flows
Locations:
- stores and several page-level effects

Not all async actions expose loading status, causing inconsistent UX during network latency.

Recommendation:
- introduce per-action loading/error fields in stores or dedicated request hooks

## Suggested short roadmap
1. Fix startup auth bootstrapping and token validation path.
2. Centralize role and permission helpers.
3. Repair create-button permission logic in main view.
4. Extract shared journal form model and converters.
5. Add robust API error parser and loading state conventions.
