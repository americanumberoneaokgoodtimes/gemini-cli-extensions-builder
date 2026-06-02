# Gemini CLI Hook Generator

A React-based web application designed to help developers create and package extensions (hooks) for the Gemini CLI. It provides a guided, multi-step interface for defining hook metadata, triggers, and logic, ultimately generating a ready-to-use installation script.

## Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI SDK:** [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)

### Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment:**
    Create a `.env.local` file (or copy from `.env.example`) and set your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Key Commands

- `npm run dev`: Starts the Vite development server with HMR.
- `npm run build`: Compiles the application for production into the `dist/` directory.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs TypeScript type checking (`tsc --noEmit`).
- `npm run clean`: Deletes the `dist/` folder.

## Project Structure

- `index.html`: Main entry point for the browser.
- `vite.config.ts`: Vite configuration, including Tailwind and React plugins.
- `src/`:
  - `main.tsx`: React application mounting point.
  - `App.tsx`: Core application logic, state management, and multi-step form UI.
  - `index.css`: Global styles and Tailwind directives.
- `metadata.json`: Potential storage for hook-related metadata templates.

## Proactive Assistant (Gemma) Setup

The application includes a proactive "Clippy-style" assistant that runs against a self-hosted `llama.cpp` backend.

### Backend Requirements
- **Server:** [llama.cpp](https://github.com/ggerganov/llama.cpp)
- **Model:** `Gemma-4-E2B-it-Assistant` (or similar instruction-tuned Gemma models).
- **Endpoint:** `http://localhost:8080/v1/chat/completions` (configurable in `src/App.tsx`).

### Running the Backend
To interact with the web UI, the `llama.cpp` server must be started with permissive CORS headers:

```bash
./llama-server -m models/gemma-4-e2b-it.gguf --port 8080 --host 0.0.0.0 --cors-allow-origin "*"
```

### Response Format
The assistant expects a strict JSON response. While the system prompt requests this, using a grammar file (`--grammar`) in `llama.cpp` is recommended for production stability:
```json
{
  "message": "User-facing tip string",
  "patch": {
    "code": "Updated code string",
    "trigger": "updated_trigger"
  }
}
```

## Development Conventions

- **Styling:** Use Tailwind CSS utility classes. The project uses a dark, terminal-inspired aesthetic with `#00FF00` (green) as the primary accent color.
- **State Management:** Currently uses React's `useState` within `App.tsx` to manage form data and navigation.
- **Components:** Logic is centralized in `App.tsx`; consider refactoring into smaller components in `src/components/` as the project grows.
- **HMR Note:** Hot Module Replacement (HMR) is configured to respect the `DISABLE_HMR` environment variable, primarily for compatibility with AI Studio's editing environment.
