# Journal of Defects - Project Overview

## What this app does
Journal of Defects is a web app for registering and tracking defect records (journal entries) across regions and substations.

The product supports:
- login by department and user
- creating defect records
- viewing, filtering, searching, and sorting records
- editing records through workflow stages
- adding comments to records
- user management for administrators

Most UI labels are in Ukrainian because this is the primary business language of the domain.

## Main user workflows

### 1) Authentication
1. User opens `/login`.
2. User picks department (REM), user, and enters password.
3. App calls `POST /Authentication/login`.
4. On success, app stores `accessToken`, `refreshToken`, and `departmentId` in localStorage.

### 2) View and search defects
1. User opens `/main-view`.
2. App loads journal entries with pagination and optional query params (`page`, `sortBy`, `order`, `filters`, `search`).
3. Table renders formatted rows with person names and dates.

### 3) Create defect record
1. User opens `/create`.
2. App loads lookups (object types, places, substations, users).
3. User submits core defect fields.
4. App calls `POST /Journals`.

### 4) Edit or copy defect record
1. User opens `/edit/:id` or `/create-copy/:id`.
2. App fetches defect by id and comments.
3. Editable fields depend on workflow state and user role.
4. App submits only changed fields via `PUT /Journals/:id` (edit) or `POST /Journals` (copy/create).

### 5) User administration
1. Admin opens `/users-admin`.
2. App loads users, roles, and departments.
3. Admin can create, edit, or delete users through corresponding API calls.

## Route map
- `/` -> redirect to `/main-view` when token exists, otherwise `/login`
- `/login` -> `AuthorizeContainer`
- `/main-view` -> `MainView` (protected)
- `/create` -> `CreatePage` (protected)
- `/edit/:id` -> `EditPage` (protected)
- `/create-copy/:id` -> `EditPage` (protected)
- `/users-admin` -> `UserAdmin` (protected)
- `*` -> `NotFoundPage`

## Tech stack
- React 19
- TypeScript
- Vite
- React Router
- Zustand for app state
- React Toastify for notifications
- MUI and Ant Design components
- TanStack React Table
- SCSS/CSS styling

## Current architecture snapshot
- App shell and route guards in `src/AppRouter.tsx`
- Authentication store in `src/store-auth.ts`
- Defect data store in `src/store-zustand.ts`
- API token handling in `src/utils/apiInterceptor.ts`
- Domain types in `src/types/*`
- Pages in `src/containers/*`
- Reusable UI in `src/components/*`

## Startup and build
- `npm run dev` - start local development server
- `npm run build` - type-check and build
- `npm run lint` - run lint checks
- `npm run preview` - preview production build

Environment variable:
- `VITE_API_URL` (default template in `.env.dist`)
