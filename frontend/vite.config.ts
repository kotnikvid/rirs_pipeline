import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
    test: {
        globals: true,
        environment: "jsdom",
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'], // Coverage reporters (text, json, html, lcov)
            reportsDirectory: './coverage', // Directory where the coverage reports will be stored
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // Backend server URL
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove /api prefix if needed
            },
        },
    },
})