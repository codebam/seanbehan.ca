/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-blocks/**/*.{html,js,svelte,ts}'
	],
	plugins: [require('flowbite/plugin'), require('flowbite-typography')],
	darkMode: 'media',
	theme: {
		colors: {
			foreground: '#000',
			background: '#fff',
			'background-secondary': '#e9ecef',
			primary: '#145799',
			secondary: '#191308',
			tertiary: '#CF5C36',
			quaternary: '#FBB02D',
			'dark-background': '#000',
			'dark-background-secondary': '#212529',
			'dark-foreground': '#fff',
			'dark-primary': '#539EE9',
			'dark-secondary': '#75F4F4',
			'dark-tertiary': '#EA9E8D',
			'dark-quaternary': '#FA824C'
		}
	}
};

module.exports = config;
