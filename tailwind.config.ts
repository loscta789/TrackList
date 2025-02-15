import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
      },
      screens: {
        xs: "375px",  // iPhone SE, petits téléphones
        phone: "480px", // Téléphones standards
        tablet: "768px", // Tablettes
        laptop: "1024px", // PC portables petits/moyens
        desktop: "1280px", // Grands écrans
        wide: "1536px", // Très grands écrans
      },
      
      spacing: {
        "section-padding": "4rem", // Consistent padding for sections
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "20px", // Softer edges for a modern look
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for a modern UI
        strong: "0 6px 18px rgba(0, 0, 0, 0.2)", // Stronger shadow
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
