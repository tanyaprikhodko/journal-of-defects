# Architecture and Code Map

## High-level architecture
The app is a client-side React SPA with two core state domains:
- authentication domain (`useAuthStore`)
- journal domain (`useTableStore`)

API communication uses `fetchWithAuth`, which attaches access tokens and handles token refresh when requests return 401.

## Runtime flow
1. Router checks for `accessToken` presence in localStorage.
2. Protected routes render only when token exists.
3. Containers invoke store methods.
4. Store methods call API endpoints.
5. Store updates state.
6. Components re-render from store subscriptions.

## State management

### Auth store (`src/store-auth.ts`)
Responsibilities:
- login/logout
- load departments and users
- fetch user by id
- optional token refresh method (`refreshTokenAsync`)

Key state:
- `departments`
- `users`
- `isAuthenticated`
- `currentUser`

### Journal store (`src/store-zustand.ts`)
Responsibilities:
- journal table loading and caching by id
- comments loading/creation
- lookup loading (object types, places, substations, roles)
- journal create/update/delete
- user create/update/delete (admin flows)
- filter state

Key state:
- `tableData`
- `tableDataById`
- `commentsById`
- `objectTypes`
- `lookupPlaces`
- `usersByRegionId`
- `substations`
- `roles`
- `appliedFilters`
- `currentPage`, `totalPages`

## API and auth behavior

### Base URL
- `src/config.ts` reads `VITE_API_URL` with fallback `http://localhost:5188/api`.

### Authenticated fetch
- `src/utils/apiInterceptor.ts` exports `fetchWithAuth`.
- Adds `Authorization: Bearer <accessToken>` when token exists.
- On 401:
  - attempts `POST /Authentication/refresh-token`
  - updates tokens in localStorage
  - retries original request
  - on failure clears auth data and redirects to `/login`

### JWT helper
- `src/utils/index.ts` exports `parseJwt`.
- Decodes claims and normalizes keys by stripping URI prefixes.

## Endpoint map used by frontend

Authentication:
- `POST /Authentication/login`
- `POST /Authentication/refresh-token`

Journals:
- `GET /Journals`
- `GET /Journals/{id}`
- `POST /Journals`
- `PUT /Journals/{id}`
- `DELETE /Journals/{id}`

Comments:
- `GET /Journals/{id}/comments`
- `POST /Comments`

Users:
- `GET /Users`
- `GET /Users/{id}`
- `GET /Users/by-region/{regionId}`
- `POST /Users`
- `PUT /Users/{id}`
- `DELETE /Users/{id}`

Lookups:
- `GET /Lookups/regions`
- `GET /Lookups/objectTypes`
- `GET /Lookups/places`
- `GET /Lookups/substationRegions`
- `GET /Lookups/roles`

## File-by-file map

### Root
- `package.json` - scripts and dependencies
- `vite.config.ts` - Vite config with React plugin
- `eslint.config.js` - lint configuration
- `tsconfig*.json` - TypeScript project configs
- `index.html` - app mount page

### App shell
- `src/main.tsx` - React root entrypoint
- `src/AppRouter.tsx` - router and private route guard
- `src/App.tsx` - legacy/simple component (not used by `main.tsx`)
- `src/config.ts` - API base URL helper

### Stores
- `src/store-auth.ts` - auth and user directory state/actions
- `src/store-zustand.ts` - journal, lookup, comments, and admin actions

### Utilities
- `src/utils/apiInterceptor.ts` - auth fetch wrapper and refresh queue
- `src/utils/index.ts` - utility exports and JWT parser

### Containers (pages)
- `src/containers/AuthorizeContainer.tsx` - login flow
- `src/containers/MainView.tsx` - main table page with filters/sort/search/pagination
- `src/containers/CreatePage.tsx` - create new journal record
- `src/containers/EditPage.tsx` - edit/copy record and role-based field control
- `src/containers/UserAdmin.tsx` - user create/edit/delete UI
- `src/containers/NotFoundPage.tsx` - unknown route fallback

### Components
- `src/components/Table.tsx` - reusable table rendering
- `src/components/ColumnSort.tsx` - sort controls
- `src/components/FiltersModal.tsx` - filter modal and apply/reset flow
- `src/components/CommentsModal.tsx` - comments read/add dialog
- `src/components/DeleteConformation.tsx` - delete confirmation modal

### Types and constants
- `src/types/auth.ts` - auth-related contracts
- `src/types/store.ts` - store contracts and journal payload types
- `src/types/table.ts` - table row and display model
- `src/types/components.ts` - component prop interfaces
- `src/types/index.ts` - type exports barrel
- `src/constants/tableColumns.ts` - labels, sort options, initial row data, condition color mapping

### Styling
- `src/index.css` - global defaults
- `src/App.css` - app-level styles
- `src/containers/styles/*.scss` - page styles
- `src/components/styles/*.scss|*.css` - component styles

## Role-based behavior summary
Role checks are mostly string matching against JWT role claim in container pages.

Common role strings used:
- `Адміністратор`
- `Технічний керівник`
- `Виконавець`
- `Старший диспетчер`
- `Диспетчер`
- `Перегляд всіх журналів`

`EditPage` uses workflow state + role to enable/disable field groups.

## Known technical debt hotspots
- `src/main.tsx`: initial token refresh call is commented out.
- `src/App.tsx`: appears unused and contains debug-like red background.
- `src/containers/MainView.tsx`: create button disable check likely uses incorrect boolean logic.
- `src/containers/CreatePage.tsx` and `src/containers/EditPage.tsx`: duplicate form logic.
- Multiple files: role names are hardcoded as string literals.
