# SvelteKit + Appwrite Auth Template

A modern authentication template built with SvelteKit and Appwrite, providing a robust foundation for web applications requiring user authentication.

## Features

- 🔐 Full authentication flow (Login, Register, Logout)
- ⚡ Powered by SvelteKit
- 🎨 Styled with Tailwind CSS
- 🔧 Appwrite Backend Integration
- 📱 Responsive Design
- 🔄 Real-time updates using Appwrite client SDK
- 🛡️ Role-based access control

## Important Note

This template implements a dual authentication strategy:

- Browser-based requests (real-time updates, permission-based filtering) use the Appwrite Browser SDK via `appwrite-browser.ts`
- Server-side operations (load functions, actions, admin endpoints) use Appwrite's Server SDK with session management

The cookie fallback mechanism is implemented in `/routes/dashboard/+layout.svelte` to handle environments where third-party cookies are blocked or to as measure to ensure realtime functionality. 

## Getting Started

1. Clone this repository
2. Install dependencies:
3. Copy `.env.example` to `.env` and update the values:
