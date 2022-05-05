import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
    /* access vite dotenv values in the index.html templating */
    plugins: [createHtmlPlugin({ inject: import.meta })],
})