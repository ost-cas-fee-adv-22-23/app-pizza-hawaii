/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: 'class',
	presets: [require('@smartive-education/pizza-hawaii/tailwind')],
	content: ['./src/**/*.{ts,tsx}', './node_modules/@smartive-education/pizza-hawaii/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [],
};
