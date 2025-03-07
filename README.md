# React + TypeScript + Vite

This project is a React frontend built with TypeScript and Vite. It provides a fast development experience with HMR (Hot Module Replacement) and ESLint configurations.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [pnpm](https://pnpm.io/) if you prefer

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Development Server

To start the local development server, run:
   ```sh
   npm run dev
   ```
This will start the app and serve it on `http://localhost:5173/` (or another available port if 5173 is in use).

### Building for Production

To create an optimized production build:
   ```sh
   npm run build
   ```
The build output will be generated in the `dist/` folder.

### Linting & Formatting

To run ESLint and check for linting issues:
   ```sh
   npm run lint
   ```

## Additional Notes

This project uses the following official Vite plugins:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

For expanding ESLint configurations, refer to the [Vite ESLint guide](https://vitejs.dev/guide/).

---

Let me know if you need any modifications! 🚀
