# Pillar: Your Personal AI Companion for Growth

Pillar is a comprehensive web application designed to be your personal guide for growth and accountability. It combines personalized planning, habit tracking, journaling, and financial management with the power of AI to provide tailored insights and support on your journey to a better life.

## ✨ Key Features

-   **Dashboard**: A central hub to view your daily progress, longest streaks, and recent activities at a glance.
-   **AI Personal Manual**: Generate a personalized plan based on your goals and challenges, with AI-driven advice on identity, routines, habits, and more.
-   **Habit Tracking**: Create, track, and build lasting habits. Monitor your streaks and mark daily completions.
-   **AI-Driven Journaling**: Record your thoughts and receive AI-powered sentiment and mood analysis to gain deeper self-awareness.
-   **Finance Tracker**: A simple ledger to manage your income, expenses, et cetera, with a clear overview of your financial health.
-   **Accountability Partners**: Invite trusted partners to share your progress. Generate AI-summarized reports on your habits, journal entries, and finances to share with them.
-   **Secure Authentication**: User accounts are managed securely with Firebase Authentication.

## 🚀 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI**: [React](https://reactjs.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit) with Gemini models
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 📂 Project Structure

The project follows a standard Next.js App Router structure:

```
.
├── src/
│   ├── app/                # Application routes and pages
│   ├── ai/                 # Genkit flows and AI logic
│   ├── components/         # Reusable React components (UI and layout)
│   ├── firebase/           # Firebase configuration, hooks, and providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions, types, and constants
│   └── services/           # Backend services (e.g., data fetching for reports)
├── public/               # Static assets
├── .env.local            # Local environment variables (requires setup)
└── ...
```

## 🛠️ Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   `npm` or `yarn`

### 1. Install Dependencies

Install the required packages:

```bash
npm install
```

### 2. Set Up Environment Variables

This project requires a Firebase project and a Google AI API key to function.

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open `.env` and add your Firebase and Google AI credentials.

#### **Firebase Configuration**

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  In your project, go to **Project Settings** > **General**.
3.  Under "Your apps", click the web icon (`</>`) to add a new web app.
4.  Give it a name and register the app.
5.  You will be given a `firebaseConfig` object. Copy the values into your `.env` file:

```env
# .env

# Firebase Client Config
# Found in your Firebase project settings -> General -> Your apps -> Web app
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:123...:web:abc..."
```

6.  In the Firebase Console, navigate to **Build > Authentication** and enable the **Email/Password** sign-in provider.
7.  Navigate to **Build > Firestore Database** and create a database. Start in **test mode** for easy development (you can secure it later with `firestore.rules`).

#### **Google AI (Gemini) API Key**

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to generate an API key.
2.  Add the key to your `.env` file:

```env
# .env

# Google AI (for Genkit)
GEMINI_API_KEY="AIza..."
```

### 3. Run the Development Servers

This project requires two development servers running concurrently: one for the Next.js frontend and one for the Genkit AI flows.

**In your first terminal, run the Next.js app:**

```bash
npm run dev
```

Your app will be available at [http://localhost:9002](http://localhost:9002).

**In a second terminal, run the Genkit server:**

```bash
npm run genkit:watch
```

This starts the Genkit development UI, which allows you to inspect and test your AI flows. It will be available at [http://localhost:4000](http://localhost:4000).

## 📜 Available Scripts

-   `npm run dev`: Starts the Next.js development server with Turbopack.
-   `npm run build`: Builds the Next.js app for production.
-   `npm run start`: Starts the production Next.js server.
-   `npm run lint`: Lints the project files.
-   `npm run genkit:dev`: Starts the Genkit development server once.
-   `npm run genkit:watch`: Starts the Genkit development server in watch mode.
