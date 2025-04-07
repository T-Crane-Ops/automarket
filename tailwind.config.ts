import type { Config } from "tailwindcss";

export default {
  darkMode: ['class', 'class'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': 'hsl(var(--primary-50))',
  				'100': 'hsl(var(--primary-100))',
  				'200': 'hsl(var(--primary-200))',
  				'300': 'hsl(var(--primary-300))',
  				'400': 'hsl(var(--primary-400))',
  				'500': 'hsl(var(--primary-500))',
  				'600': 'hsl(var(--primary-600))',
  				'700': 'hsl(var(--primary-700))',
  				'800': 'hsl(var(--primary-800))',
  				'900': 'hsl(var(--primary-900))',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				hover: 'hsl(var(--primary-hover))',
  				active: 'hsl(var(--primary-active))'
  			},
  			neutral: {
  				'0': '#FFFFFF',
  				'50': '#F9FAFB',
  				'100': '#F3F4F6',
  				'200': '#E5E7EB',
  				'300': '#D1D5DB',
  				'400': '#9CA3AF',
  				'500': '#6B7280',
  				'600': '#4B5563',
  				'700': '#374151',
  				'800': '#1F2937',
  				'900': '#111827'
  			},
  			accent: {
  				blue: {
  					DEFAULT: '#3B82F6',
  					light: '#93C5FD',
  					dark: '#1D4ED8'
  				},
  				green: {
  					DEFAULT: '#10B981',
  					light: '#6EE7B7',
  					dark: '#047857'
  				},
  				yellow: {
  					DEFAULT: '#F59E0B',
  					light: '#FCD34D',
  					dark: '#B45309'
  				},
  				orange: {
  					DEFAULT: '#F97316',
  					light: '#FDBA74',
  					dark: '#C2410C'
  				},
  				red: {
  					DEFAULT: '#EF4444',
  					light: '#FCA5A5',
  					dark: '#B91C1C'
  				},
  				purple: {
  					DEFAULT: '#8B5CF6',
  					light: '#C4B5FD',
  					dark: '#6D28D9'
  				}
  			},
  			status: {
  				success: {
  					DEFAULT: '#22C55E',
  					light: '#86EFAC',
  					dark: '#15803D'
  				},
  				warning: {
  					DEFAULT: '#F59E0B',
  					light: '#FCD34D',
  					dark: '#B45309'
  				},
  				error: {
  					DEFAULT: '#EF4444',
  					light: '#FCA5A5',
  					dark: '#B91C1C'
  				},
  				info: {
  					DEFAULT: '#3B82F6',
  					light: '#93C5FD',
  					dark: '#1D4ED8'
  				}
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontSize: {
  			h1: [
  				'2rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.02em'
  				}
  			],
  			h2: [
  				'1.5rem',
  				{
  					lineHeight: '1.3',
  					letterSpacing: '-0.015em'
  				}
  			],
  			h3: [
  				'1.25rem',
  				{
  					lineHeight: '1.4',
  					letterSpacing: '-0.01em'
  				}
  			],
  			h4: [
  				'1.125rem',
  				{
  					lineHeight: '1.4',
  					letterSpacing: '-0.005em'
  				}
  			],
  			body: [
  				'1rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			'body-sm': [
  				'0.875rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			caption: [
  				'0.75rem',
  				{
  					lineHeight: '1.4'
  				}
  			],
  			button: [
  				'0.875rem',
  				{
  					lineHeight: '1',
  					letterSpacing: '0.01em'
  				}
  			]
  		},
  		fontWeight: {
  			regular: '400',
  			medium: '500',
  			semibold: '600',
  			bold: '700'
  		},
  		spacing: {
  			xs: '0.25rem',
  			sm: '0.5rem',
  			md: '1rem',
  			lg: '1.5rem',
  			xl: '2rem',
  			xxl: '3rem',
  			'2xs': '0.125rem',
  			'3xl': '4rem',
  			'4xl': '5rem'
  		},
  		borderRadius: {
  			none: '0',
  			xs: '0.125rem',
  			sm: '0.25rem',
  			md: '0.375rem',
  			lg: '0.5rem',
  			xl: '0.75rem',
  			'2xl': '1rem',
  			'3xl': '1.5rem',
  			full: '9999px',
  			btn: 'var(--radius-btn)',
  			card: 'var(--radius-card)',
  			input: 'var(--radius-input)',
  			'shadcn-lg': 'var(--radius)',
  			'shadcn-md': 'calc(var(--radius) - 2px)',
  			'shadcn-sm': 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  			DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  			'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  			inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  			card: '0px 4px 16px rgba(0, 0, 0, 0.08)',
  			'card-hover': '0px 8px 24px rgba(0, 0, 0, 0.12)',
  			button: '0px 2px 4px rgba(0, 0, 0, 0.08)',
  			'button-hover': '0px 4px 8px rgba(0, 0, 0, 0.12)',
  			focus: '0 0 0 3px rgba(var(--primary-rgb), 0.4)',
  			none: 'none'
  		},
  		keyframes: {
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-1000px 0'
  				},
  				'100%': {
  					backgroundPosition: '1000px 0'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-8px)'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.5'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			shimmer: 'shimmer 2s linear infinite',
  			float: 'float 5s ease-in-out infinite',
  			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
