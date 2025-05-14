# NewSFChat

NewSFChat is a real-time demo chat application built with React, Redux, Firebase, and TypeScript. It provides a seamless user experience for messaging, user management, and chat functionality.

## Features

- **Real-Time Messaging**: Powered by Firebase Firestore for real-time updates.
- **User Authentication**: Manage user sessions and authentication.
- **Redux State Management**: Centralized state management using Redux Toolkit.
- **React Context**: Context API for managing app-wide state like loading indicators and profile images.
- **Lazy Loading**: Optimized performance with React's `lazy` and `Suspense`.
- **Responsive Design**: Built with a responsive layout for various screen sizes.
- **TypeScript**: Strongly typed codebase for better maintainability and developer experience.

---

## Project Structure

src/
├── api/ # Firebase API integration
├── assets/ # Static assets (e.g., SVGs)
├── components/ # Chat and user components
│ ├── chat/ # Chat UI (header, footer, messages)
│ └── user/ # User list, header, search, preview
├── context/ # React context providers
│ └── appContext/ # Global app context
├── constants/ # Enum constants
├── interfaces/ # TypeScript interface definitions
├── pages/ # Route-level views (Home, Auth)
├── redux/ # Redux store, slices, thunks, hooks
│ ├── chat/ | auth/ | hooks/ # Organized state logic
├── routes/ # Protected routes and error handling
├── utils/ # Custom hooks and helper logic
├── UI/ # Generic UI components (Layout, Loader)
├── \_index.scss # Global SCSS
├── App.tsx # Root application component
└── main.tsx # Application entry point

---

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Redux Toolkit**: State management for predictable state updates.
- **Firebase**: Backend-as-a-service for real-time database and authentication.
- **TypeScript**: Strongly typed JavaScript for better code quality.
- **SCSS**: Styling with modular and reusable stylesheets.

---

## Key Files

- **`src/main.tsx`**: Application entry point.
- **`src/redux/chat/chatSlice.ts`**: Redux slice for managing chat state.
- **`src/context/appContext/AppContext.tsx`**: Context for managing app-wide state.
- **`src/components/chat/Chat.tsx`**: Main chat component.
- **`src/pages/home/Home.tsx`**: Home page component.
