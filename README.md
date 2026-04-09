# Journal of Defects

Journal of Defects is a React + TypeScript frontend for defect journal management.
It supports authentication, journal record lifecycle management, comments, filtering/sorting/search, and user administration.

## Documentation

Project documentation is organized in the `docs` folder:

- `docs/PROJECT_OVERVIEW.md` - product purpose, flows, routes, and setup summary
- `docs/ARCHITECTURE_AND_CODEMAP.md` - architecture, API flow, state management, file-by-file map
- `docs/KNOWN_ISSUES_AND_RECOMMENDATIONS.md` - current risks and prioritized improvements

## Quick Start

1. Install dependencies:
   `npm install`
2. Create environment file (if missing):
   `cp -n .env.dist .env`
3. Start development server:
   `npm run dev`

Default API URL template:
- `VITE_API_URL=http://localhost:5188/api`

## Scripts

- `npm run dev` - run dev server
- `npm run build` - type-check and build production bundle
- `npm run lint` - run ESLint
- `npm run preview` - preview production build locally

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- TanStack React Table
- React Toastify
- MUI and Ant Design
- SCSS/CSS
