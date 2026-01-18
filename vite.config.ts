import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: { target: 'esnext', outDir: 'demo-dist' },
	server: { allowedHosts: true, port: 3000 },
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@demo': resolve(__dirname, 'demo'),
		},
	},
	root: 'demo',
})
