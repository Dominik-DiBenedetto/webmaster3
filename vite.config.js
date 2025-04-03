import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    assetsInclude: ["**/*.gltf"],
    build: {
        rollupOptions: {
        input: {
            main: resolve(__dirname, 'index.html'),
            cart: resolve(__dirname, 'cart.html'),
            reference_pg: resolve(__dirname, 'reference_page.html'),
            builder: resolve(__dirname, 'saladbuilder.html'),
            scene_loader: "/javascript/scene_loader.js"
        },
        },
    },
})