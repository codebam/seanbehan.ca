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
			primary: '#583C96',
			secondary: '#252627',
			tertiary: '#FF6542',
			quaternary: '#EF798A',
			'background-dark': '#000',
			'foreground-dark': '#fff',
			'dark-primary': '#A38AD0',
			'dark-secondary': '#779FA1',
			'dark-tertiary': '#FF6542',
			'dark-quaternary': '#e26d5a'
		}
	}
};

module.exports = config;
