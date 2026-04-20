# Inventory App

A production-style inventory management web app designed for small teams that need reliable stock visibility, fast updates, and a modern user experience.

---

## Problem Statement

Small teams often manage inventory through spreadsheets or disconnected tools, which leads to:

- inaccurate stock counts,
- delayed updates across team members,
- weak visibility into low-stock risks, and
- poor accountability around edits.

This project solves that by providing a centralized, real-time inventory dashboard with authentication, item management workflows, and clean operational reporting.

---

## Tech Stack

### Frontend

- **React 19** for UI architecture
- **Vite 8** for fast development and optimized builds
- **React Router 7** for protected routing and page structure
- **Tailwind CSS 4** for utility-first styling and dark mode support
- **Lucide React** for iconography

### Backend & Data

- **Firebase Authentication** for user sign-in/session handling
- **Cloud Firestore** for real-time inventory data storage and sync

### Tooling

- **ESLint** for code quality
- **npm** for package management and scripts

---

## Key Features

- **Secure authentication flow**
  - Login-protected routes and session-aware navigation
  - Dedicated Auth page with account details, sign out, and password reset email action

- **Real-time inventory synchronization**
  - Firestore `onSnapshot` listener keeps the inventory list live across sessions
  - Add, update, and delete actions persist instantly to cloud storage

- **Inventory operations UI**
  - Controlled form for adding items with validation
  - Search and category filters for quick lookup
  - Inline stock health indicators (in-stock / low-stock)
  - Drawer-based edit workflow for clean in-context updates

- **Performance optimizations**
  - **Memoized table rows** (`React.memo`) to minimize unnecessary row re-renders
  - **Route-level code splitting** (`React.lazy` + `Suspense`) for faster initial loading
  - **Professional loading skeletons** while data is fetching

- **User experience enhancements**
  - Light/Dark theme toggle with local persistence
  - Dashboard KPIs (total items, low-stock count, inventory value)
  - Success and error feedback states for key actions

---

## Project Structure

```text
src/
  components/
    common/
    ui/
  context/
    AuthContext.jsx
    InventoryContext.jsx
  features/
    inventory/
  pages/
  services/
```

---

## Setup Instructions

### 1) Clone and install

```bash
git clone <your-repo-url>
cd end-term-project
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3) Firebase setup checklist

- Enable **Authentication > Email/Password**
- Create at least one user in **Authentication > Users**
- Create a Firestore database
- Ensure your Firestore rules allow intended read/write access for authenticated users

### 4) Run locally

```bash
npm run dev
```

Open the app at the local URL shown by Vite (typically `http://localhost:5173`).

### 5) Quality and production build

```bash
npm run lint
npm run build
npm run preview
```

---

## Demo Flow

1. Sign in with a Firebase Auth user.
2. Navigate to **Inventory** and add/edit stock items.
3. Use filters/search to locate products quickly.
4. View dashboard metrics and low-stock alerts.
5. Toggle light/dark mode for preferred viewing.

---

## Portfolio Notes

This project demonstrates:

- scalable React feature organization,
- real-time cloud data integration,
- user-centric UI/UX refinement,
- and practical frontend performance engineering.
