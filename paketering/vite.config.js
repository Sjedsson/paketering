import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'  // Här slänger vi in setupTests.js, vår egen backstage manager som förbereder allt så vi slipper trassla med imports i varje testfil. A hero without a cape!
  }
})
