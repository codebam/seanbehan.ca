/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [],
	darkMode: 'media',
	theme: {
		colors: {
			foreground: '#000',
			background: '#fff',
			'background-secondary': '#eee',
			'background-tertiary': '#e0e0e0',
			primary: '#145799',
			secondary: '#191308',
			tertiary: '#CF5C36',
			quaternary: '#FBB02D',
			'dark-background': '#000',
			'dark-background-secondary': '#111111',
			'dark-background-tertiary': '#1f1f1f',
			'dark-foreground': '#fff',
			'dark-primary': '#539EE9',
			'dark-secondary': '#B2E6D4',
			'dark-tertiary': '#EA9E8D',
			'dark-quaternary': '#FA824C'
		}
	}
};

module.exports = config;
