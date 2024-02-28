import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/builder/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("@tailwindcss/typography")],
};

export default config;
