import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';

export default {
  darkMode: 'media',
  content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],

  theme: {
    extend: {}
  },

  plugins: [typography, skeleton({ themes: [themes.catppuccin] })]
} as Config;
