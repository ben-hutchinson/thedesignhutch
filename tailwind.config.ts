import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      colors: {
        base: {
          950: "#151714",
          900: "#1d201c",
          800: "#292c27",
        },
        brand: {
          purple: "#35279A",
        },
        accent: {
          blue: "#3453d1",
          orange: "#f0642b",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        glow: "0 12px 26px -18px rgba(52,83,209,0.8)",
        "glow-orange":
          "0 0 0 1px rgba(249,115,22,0.12), 0 12px 30px -16px rgba(249,115,22,0.38)",
        card: "0 24px 60px -36px rgba(20,20,16,0.5)",
      },
      backgroundImage: {
        "brand-radial":
          "radial-gradient(circle at 18% 4%, rgba(59,130,246,0.15), transparent 42%), radial-gradient(circle at 82% 18%, rgba(249,115,22,0.12), transparent 40%)",
        "hero-noise":
          "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.16), transparent 40%), radial-gradient(circle at 80% 40%, rgba(249,115,22,0.16), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
