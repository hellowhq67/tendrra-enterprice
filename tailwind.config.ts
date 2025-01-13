const defaultTheme = require("tailwindcss/defaultTheme");

const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class", "class"],
  theme: {
  
  	extend: {
		boxShadow: {
			input: '0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)'
		},
		animation: {
			spotlight: 'spotlight 2s ease .75s 1 forwards',
			shimmer: 'shimmer 2s linear infinite',
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out'
		},
		keyframes: {
			shimmer: {
				from: {
					backgroundPosition: '0 0'
				},
				to: {
					backgroundPosition: '-200% 0'
				}
			},
			spotlight: {
				'0%': {
					opacity: 0,
					transform: 'translate(-72%, -62%) scale(0.5)'
				},
				'100%': {
					opacity: 1,
					transform: 'translate(-50%,-40%) scale(1)'
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
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
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
	    colors: {
          sidebar: {
            DEFAULT: 'hsl(var(--sidebar-background))',
            foreground: 'hsl(var(--sidebar-foreground))',
            primary: 'hsl(var(--sidebar-primary))',
            'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
            accent: 'hsl(var(--sidebar-accent))',
            'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
            border: 'hsl(var(--sidebar-border))',
            ring: 'hsl(var(--sidebar-ring))',
          }
        }
	}
  	
  },
  plugins: [
	require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 800 800" opacity="0.18" width="800" height="800"><g stroke-width="2.25" stroke="hsla(261, 18%, 34%, 1.00)" fill="none"><rect width="160" height="160" x="0" y="0" opacity="0.15"></rect><circle r="7.894736842105264" cx="0" cy="0" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="160" y="0" opacity="0.15"></rect><circle r="7.894736842105264" cx="160" cy="0" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="320" y="0" opacity="0.15"></rect><circle r="7.894736842105264" cx="320" cy="0" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="480" y="0" opacity="0.15"></rect><circle r="7.894736842105264" cx="480" cy="0" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="640" y="0" opacity="0.15"></rect><circle r="7.894736842105264" cx="640" cy="0" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="800" y="0" opacity="0.15"></rect><circle r="7.894736842105264" cx="800" cy="0" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="0" y="160" opacity="0.15"></rect><circle r="7.894736842105264" cx="0" cy="160" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="160" y="160" opacity="0.15"></rect><circle r="7.894736842105264" cx="160" cy="160" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="320" y="160" opacity="0.15"></rect><circle r="7.894736842105264" cx="320" cy="160" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="480" y="160" opacity="0.15"></rect><circle r="7.894736842105264" cx="480" cy="160" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="640" y="160" opacity="0.15"></rect><circle r="7.894736842105264" cx="640" cy="160" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="800" y="160" opacity="0.15"></rect><circle r="7.894736842105264" cx="800" cy="160" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="0" y="320" opacity="0.15"></rect><circle r="7.894736842105264" cx="0" cy="320" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="160" y="320" opacity="0.15"></rect><circle r="7.894736842105264" cx="160" cy="320" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="320" y="320" opacity="0.15"></rect><circle r="7.894736842105264" cx="320" cy="320" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="480" y="320" opacity="0.15"></rect><circle r="7.894736842105264" cx="480" cy="320" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="640" y="320" opacity="0.15"></rect><circle r="7.894736842105264" cx="640" cy="320" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="800" y="320" opacity="0.15"></rect><circle r="7.894736842105264" cx="800" cy="320" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="0" y="480" opacity="0.15"></rect><circle r="7.894736842105264" cx="0" cy="480" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="160" y="480" opacity="0.15"></rect><circle r="7.894736842105264" cx="160" cy="480" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="320" y="480" opacity="0.15"></rect><circle r="7.894736842105264" cx="320" cy="480" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="480" y="480" opacity="0.15"></rect><circle r="7.894736842105264" cx="480" cy="480" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="640" y="480" opacity="0.15"></rect><circle r="7.894736842105264" cx="640" cy="480" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="800" y="480" opacity="0.15"></rect><circle r="7.894736842105264" cx="800" cy="480" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="0" y="640" opacity="0.15"></rect><circle r="7.894736842105264" cx="0" cy="640" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="160" y="640" opacity="0.15"></rect><circle r="7.894736842105264" cx="160" cy="640" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="320" y="640" opacity="0.15"></rect><circle r="7.894736842105264" cx="320" cy="640" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="480" y="640" opacity="0.15"></rect><circle r="7.894736842105264" cx="480" cy="640" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="640" y="640" opacity="0.15"></rect><circle r="7.894736842105264" cx="640" cy="640" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="800" y="640" opacity="0.15"></rect><circle r="7.894736842105264" cx="800" cy="640" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="0" y="800" opacity="0.15"></rect><circle r="7.894736842105264" cx="0" cy="800" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="160" y="800" opacity="0.15"></rect><circle r="7.894736842105264" cx="160" cy="800" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="320" y="800" opacity="0.15"></rect><circle r="7.894736842105264" cx="320" cy="800" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="480" y="800" opacity="0.15"></rect><circle r="7.894736842105264" cx="480" cy="800" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="640" y="800" opacity="0.15"></rect><circle r="7.894736842105264" cx="640" cy="800" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle><rect width="160" height="160" x="800" y="800" opacity="0.15"></rect><circle r="7.894736842105264" cx="800" cy="800" fill="hsla(261, 18%, 34%, 1.00)" stroke="none"></circle></g></svg>`
            )}")`,
          }),

          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}