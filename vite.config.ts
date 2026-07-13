import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : undefined,
		alias: {
			'$routes': path.resolve(__dirname, 'src/routes')
		}
	},
	test: {
		environment: 'jsdom',
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		globals: true,
		coverage: {
			reportsDirectory: 'static/coverage',
			include: ['src/**/*.{ts,svelte}'],
			exclude: [
				'src/**/*.d.ts',
				'src/lib/types/**'
			]
		}
	}
}));
