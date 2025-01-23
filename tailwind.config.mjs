/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			'fontFamily': {
				'manrope': ['Manrope Variable', 'sans-serif']
			},
			'colors': {
				'dim-orange': '#D87D4A',
				'light-gray': '#F1F1F1',
				'lighter-gray': '#CFCFCF',
				'dark-gray': '#979797'
			},
			'backgroundImage': {
				'home-mobile-header': 'url(/image-header.jpg)',
				'home-mobile-zx7-speaker': 'url(/mobile/image-speaker-zx7.jpg)',
				'home-tablet-zx7-speaker': 'url(/tablet/image-speaker-zx7.jpg)',
				'home-desktop-zx7-speaker': 'url(/desktop/image-speaker-zx7.jpg)',
				'circle-pattern': 'url(/pattern-circles.svg)'
			}
		},
	},
	plugins: [],
}
