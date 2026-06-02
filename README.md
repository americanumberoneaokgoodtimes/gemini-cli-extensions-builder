<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1642d94a-88c4-4df3-a8a5-94c033ef2477

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Proactive Assistant Setup (Optional)

This app features a proactive assistant that offers context-aware suggestions. To enable it without an API key, you can run a self-hosted `llama.cpp` server.

1.  **Install llama.cpp:** Follow the [setup guide](https://github.com/ggerganov/llama.cpp).
2.  **Download Gemma:** Obtain the `Gemma-4-E2B-it-Assistant` GGUF model.
3.  **Start the server:**
    ```bash
    ./llama-server -m models/gemma-4-e2b-it.gguf --port 8080 --cors-allow-origin "*"
    ```
4.  The assistant in the web UI will automatically connect to `http://localhost:8080`.
