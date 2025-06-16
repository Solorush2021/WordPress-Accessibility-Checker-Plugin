import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['PT Sans', 'sans-serif'],
        code: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'logo-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            filter: 'drop-shadow(0 0 2px hsl(var(--primary) / 0.5)) drop-shadow(0 0 2px hsla(340, 80%, 70%, 0.3))',
          },
          '50%': {
            transform: 'scale(1.08)',
            filter: 'drop-shadow(0 0 5px hsl(var(--primary) / 0.8)) drop-shadow(0 0 5px hsla(340, 80%, 70%, 0.5))',
          },
        },
        'scroll-right-to-left': {
          '0%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
        'float-orb1': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0.3' },
          '25%': { transform: 'translate(40px, 20px) rotate(10deg)', opacity: '0.6' },
          '50%': { transform: 'translate(-20px, -30px) rotate(-5deg)', opacity: '0.4' },
          '75%': { transform: 'translate(30px, -10px) rotate(5deg)', opacity: '0.7' },
        },
        'float-orb2': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0.25' },
          '25%': { transform: 'translate(-50px, -30px) rotate(-15deg)', opacity: '0.5' },
          '50%': { transform: 'translate(30px, 40px) rotate(10deg)', opacity: '0.35' },
          '75%': { transform: 'translate(-20px, 20px) rotate(-8deg)', opacity: '0.6' },
        },
        'float-orb3': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: '0.35'},
          '25%': { transform: 'translate(20px, -40px) rotate(20deg) scale(1.1)', opacity: '0.65'},
          '50%': { transform: 'translate(-30px, 10px) rotate(-10deg) scale(0.9)', opacity: '0.4'},
          '75%': { transform: 'translate(10px, 30px) rotate(15deg) scale(1.05)', opacity: '0.55'},
        },
        'pulse-orb': {
          '0%, 100%': { opacity: '0.3', filter: 'blur(50px)' },
          '50%': { opacity: '0.7', filter: 'blur(60px)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'logo-pulse': 'logo-pulse 2.5s infinite ease-in-out',
        'scroll-right-to-left': 'scroll-right-to-left 30s linear infinite',
        'float-orb1': 'float-orb1 20s infinite ease-in-out, pulse-orb 7s infinite ease-in-out',
        'float-orb2': 'float-orb2 25s infinite ease-in-out -5s, pulse-orb 9s infinite ease-in-out -2s',
        'float-orb3': 'float-orb3 18s infinite ease-in-out -10s, pulse-orb 6s infinite ease-in-out -1s',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
