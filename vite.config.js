import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path';

export default defineConfig({
    resolve:{
        alias:{
            /* avoid using long relative paths by using @ to reference from the src folder */
            '@' : path.resolve(__dirname, './src')
        },
    },
    /* access vite dotenv values in the index.html templating */
    plugins: [createHtmlPlugin({ inject: import.meta })],
})