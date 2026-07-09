import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				phone: {
					bg: '#1a1a2e',
					screen: '#16213e',
					bubbleSent: '#0f3460',
					bubbleReceived: '#e94560'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
} satisfies Config;
