# CareerPilot AI

CareerPilot AI is an advanced, AI-powered career platform designed to help users land their dream jobs faster. It provides tools for resume analysis, semantic job matching, skill gap detection, application tracking, and interview preparation. 

## 🚀 Features Implemented

The application provides a fully functional frontend dashboard experience. The backend and AI services are currently simulated using mock data and local storage, allowing for a complete demonstration of the user interface and user flows.

### 1. Authentication System
* **Pages:** `/login` and `/register`
* **Features:** 
  * Beautiful glass-morphism cards with email/password forms.
  * Form validation, loading states, and error handling.
  * Password visibility toggles and simulated "Remember Me".
  * Social login button placeholders (Google, GitHub).
* **Implementation:** Uses a custom `useAuth` React hook that persists user state to the browser's `localStorage`. All routes inside `(dashboard)` are protected by an auth guard that redirects unauthenticated users to `/login`.

### 2. Dashboard Shell
* **Features:**
  * **Sidebar (`Sidebar.jsx`):** A collapsible navigation menu with active state highlighting. Auto-collapses on mobile screens and provides an overlay backdrop.
  * **Top Bar (`TopBar.jsx`):** Contains a global search placeholder, notification bell with an active indicator, and a user avatar dropdown menu (Profile, Settings, Logout).
* **Implementation:** Built as a Next.js layout (`app/(dashboard)/layout.js`) shared across all authenticated routes. The layout dynamically adjusts its `marginLeft` based on the sidebar's collapsed state and window resize events.

### 3. Dashboard Home (`/dashboard`)
* **Features:**
  * Personalized, time-aware greeting (e.g., "Good morning, Alex 👋").
  * 4 dynamic stat cards displaying animated count-up numbers: Total Applications, In Interview, AI Match Score, and Resumes Uploaded.
  * Quick action buttons for common tasks (Upload Resume, Add Application, Analyze a Job).
  * A table displaying the 5 most recent job applications with color-coded status badges.
  * A congratulatory banner that appears if the user has received job offers.

### 4. Resume Manager (`/resume`)
* **Features:**
  * **Upload UI:** A drag-and-drop zone for PDF files featuring an animated upload progress bar and simulated processing delay.
  * **Resume List:** Displays uploaded resumes with file size, upload date, and a delete button.
  * **Detail View:** Shows information "extracted" from the resume, including:
    * Detected skills rendered as color-coded tags.
    * Parsed sections (Summary, Experience, Education).
    * Raw extracted text.
* **Implementation:** PDF processing is simulated. Uploaded resumes and their mock extracted data are stored in `localStorage`.

### 5. Applications Tracker (`/applications`)
* **Features:**
  * **Full CRUD:** Add, edit, and delete job applications via a modal form.
  * **Form Fields:** Company, Position, Description, Location, URL, Date, and Status.
  * **Organization:** 
    * Filter applications using status chips (All, Wishlist, Applied, Assessment, Interview, Offer, Rejected).
    * Search by company name or position.
    * Toggle between a detailed Table view and a compact Card view.
* **Implementation:** State is entirely managed via `localStorage` with helper functions in `app/lib/mockData.js`.

### 6. AI Match Analysis (`/ai-match`)
* **Features:**
  * **Input Selection:** Users select an uploaded resume and either choose a saved job application or paste a new job description.
  * **Loading State:** An animated pulsing ring and skeleton bars simulate the AI analysis process.
  * **Results Presentation:**
    * **Overall Score:** Displayed using a custom SVG circular progress ring.
    * **Category Breakdown:** Animated progress bars showing scores for Skills, Experience, Education, and Keywords.
    * **Skill Gap Analysis:** Lists of Matched Skills (green tags) and Missing Skills (red tags).
    * **AI Recommendations:** Expandable cards offering actionable advice (e.g., "Learn Docker") with priority badges and time estimates.

### 7. Interview Coach (V2 Placeholder) (`/interview-coach`)
* **Features:**
  * A polished "Coming Soon" page for future development.
  * Features a blurred preview of the intended mock interview UI.
  * Displays feature cards outlining future capabilities (AI questions, real-time feedback, score tracking).
  * An interactive "Notify Me" button.

### 8. Settings (`/settings`)
* **Features:**
  * **Profile:** Edit name and email address.
  * **Preferences:** Toggles for Dark Mode, Email Notifications, and Application Reminders.
  * **Security:** Form to change the current password (with validation).
  * **Danger Zone:** Delete account functionality with a confirmation modal.

## 🛠️ Technical Details & Architecture

### Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS 4 + Custom Vanilla CSS
* **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`) + Browser `localStorage`
* **Icons:** Inline SVGs (No external icon libraries to keep bundle size minimal)

### Design System
The application utilizes a custom **Glass-morphism Dark Theme** built on top of Tailwind CSS. Key design elements defined in `globals.css` include:
* Deep navy backgrounds (`#020817`) with vibrant violet (`#7c3aed`) and cyan (`#06b6d4`) accents.
* `glass-card`: Semi-transparent background with backdrop blur and subtle borders.
* CSS animations: `fadeIn`, `slideUp`, `float`, `glowPulse`, `shimmer` (for loading skeletons), and `countPop` (for stat numbers).
* Custom SVG progress rings and mesh gradient backgrounds.

### Data Management
Because the backend is not yet integrated, all data is handled by `app/lib/mockData.js`. This file provides:
* Seed data for a default user, applications, resumes, and AI results.
* CRUD helper functions (`getApplications`, `addApplication`, etc.) that wrap `localStorage` access.
* This structure ensures that swapping `localStorage` calls for real `fetch` or Axios API calls in the future will be straightforward and require minimal changes to the UI components.

## 💻 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing the App
1. You will land on the marketing page. Click **Get Started Free** or **Login**.
2. Enter any email and password in the auth forms (validation requires passwords to be at least 6 characters).
3. You will be redirected to the Dashboard. Feel free to interact with all features; your data will be saved locally in your browser.
