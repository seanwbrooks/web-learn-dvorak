import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // One HTML page per route; S3 serves each as a plain file
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        contact: 'contact.html',
      },
    },
  },
})
