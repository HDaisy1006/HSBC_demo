import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : undefined
	},
	test: {
		environment: 'jsdom',
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		globals: true,
		coverage: {
			reportsDirectory: 'static/coverage'
		}
	}
}));
