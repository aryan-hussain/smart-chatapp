/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/reusable/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // back50per:"rgb(15 23 42 /50%)"
        // backChatColor:"334155",
        back50per: "#fff",
        typoColor: "#000",
        primaryColor:"#13343b",
        secondaryColor:"#686263",
        showSuccess:"#13343b",
        showError:"#d97757",
        showInfo:"",


        border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        max991: { max: "991px" },
        min991: { min: "991px" },
        max500: { max: "500px" },
      },
      // keyframes: {
      //   "accordion-down": {
      //     from: {
      //       height: "0",
      //     },
      //     to: {
      //       height: "var(--radix-accordion-content-height)",
      //     },
      //   },
      //   "accordion-up": {
      //     from: {
      //       height: "var(--radix-accordion-content-height)",
      //     },
      //     to: {
      //       height: "0",
      //     },
      //   },
      //   pulse: {
      //     "0%, 100%": {
      //       opacity: 1,
      //     },
      //     "50%": {
      //       opacity: 0.5,
      //     },
      //   },
      //   spin: {
      //     from: {
      //       transform: "rotate(0deg)",
      //     },
      //     to: {
      //       transform: "rotate(360deg)",
      //     },
      //   },
      // },
      // animation: {
      //   "accordion-down": "accordion-down 0.2s ease-out",
      //   "accordion-up": "accordion-up 0.2s ease-out",
      //   pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      //   spin: "spin 1s linear infinite",
      // },
    },
    // colors: {
    //   border: "hsl(var(--border))",
    //   input: "hsl(var(--input))",
    //   ring: "hsl(var(--ring))",
    //   background: "hsl(var(--background))",
    //   foreground: "hsl(var(--foreground))",
    //   primary: {
    //     DEFAULT: "hsl(var(--primary))",
    //     foreground: "hsl(var(--primary-foreground))",
    //   },
    //   secondary: {
    //     DEFAULT: "hsl(var(--secondary))",
    //     foreground: "hsl(var(--secondary-foreground))",
    //   },
    //   destructive: {
    //     DEFAULT: "hsl(var(--destructive))",
    //     foreground: "hsl(var(--destructive-foreground))",
    //   },
    //   muted: {
    //     DEFAULT: "hsl(var(--muted))",
    //     foreground: "hsl(var(--muted-foreground))",
    //   },
    //   accent: {
    //     DEFAULT: "hsl(var(--accent))",
    //     foreground: "hsl(var(--accent-foreground))",
    //   },
    //   popover: {
    //     DEFAULT: "hsl(var(--popover))",
    //     foreground: "hsl(var(--popover-foreground))",
    //   },
    //   card: {
    //     DEFAULT: "hsl(var(--card))",
    //     foreground: "hsl(var(--card-foreground))",
    //   },
    // },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    
  },
  // plugins: [require("tailwindcss-animate")],
  // plugins: [],
};
