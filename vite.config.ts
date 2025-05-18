import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		viteCompression({
			algorithm: 'gzip',
			ext: '.gz',
			deleteOriginFile: false,
			threshold: 10240, // Only compress files larger than 10kb
			compressionOptions: {
				level: 9, // Maximum compression level
			},
		}),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom'],
					'icons-fa': ['react-icons/fa'],
					'icons-fi': ['react-icons/fi'],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		cssCodeSplit: true, // Enable CSS code splitting
		cssMinify: true, // Minify CSS
	},
	optimizeDeps: {
		include: ['react', 'react-dom'],
		exclude: ['react-icons/fa', 'react-icons/fi'],
	},
	css: {
		// Enable CSS modules
		modules: {
			localsConvention: 'camelCase',
		},
		// Enable CSS preprocessors
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/styles/variables.scss";`,
			},
		},
	},
});
