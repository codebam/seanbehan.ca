/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	plugins: [require('flowbite/plugin')],
	darkMode: 'class',
	theme: {
		colors: {
			foreground: '#000',
			background: '#fff',
			'background-dark': '#000',
			'foreground-dark': '#fff',
			primary: '#1B6052',
			secondary: '#264653',
			'dark-primary': '#2DA99B',
			'dark-secondary': '#639DB6'
		}
	}
};

module.exports = config;
