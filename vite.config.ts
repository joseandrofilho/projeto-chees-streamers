import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.GITHUB_ACTIONS === "true" ? "/projeto-chees-streamers/" : "/",
  plugins: [react()],
});
