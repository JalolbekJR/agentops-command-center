import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        panel: "#0c111d",
        panelMuted: "#111827",
        line: "#202938",
        signal: "#38bdf8",
        safe: "#34d399",
        caution: "#f59e0b",
        danger: "#fb7185"
      },
      boxShadow: {
        command: "0 24px 80px rgba(2, 6, 23, 0.45)"
      }
    }
  }
};

export default config;
