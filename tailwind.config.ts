import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	darkMode: 'media',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],

	theme: {
		// colors: {
		// 	foreground: '#000',
		// 	background: '#fff',
		// 	'background-secondary': '#eee',
		// 	'background-tertiary': '#e0e0e0',
		// 	primary: '#145799',
		// 	secondary: '#191308',
		// 	tertiary: '#CF5C36',
		// 	quaternary: '#FBB02D',
		// 	'dark-background': '#000',
		// 	'dark-background-secondary': '#111111',
		// 	'dark-background-tertiary': '#1f1f1f',
		// 	'dark-foreground': '#fff',
		// 	'dark-primary': '#539EE9',
		// 	'dark-secondary': '#B2E6D4',
		// 	'dark-tertiary': '#EA9E8D',
		// 	'dark-quaternary': '#FA824C'
		// },
		extend: {}
	},

	plugins: [typography, skeleton({ themes: { preset: ['skeleton'] } })]
} as Config;
