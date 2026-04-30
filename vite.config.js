import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default ({ mode }) => {


  const env = loadEnv(mode, process.cwd(), "");

  const backendURL = env.VITE_API_BACKEND;
  const frontendURL = env.VITE_API_FRONTEND;


  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src'),
        "@services": path.resolve(__dirname, "./src/services"),

        // "@components": path.resolve(__dirname, "./src/components"),
        // "@ui": path.resolve(__dirname, "./src/components/ui"),
        // "@forms": path.resolve(__dirname, "./src/components/forms"),
        // "@pages": path.resolve(__dirname, "./src/pages"),
        // "@hooks": path.resolve(__dirname, "./src/hooks"),
        // "@services": path.resolve(__dirname, "./src/services"),
        // "@utils": path.resolve(__dirname, "./src/utils"),
        // "@assets": path.resolve(__dirname, "./src/assets"),
        // "@layouts": path.resolve(__dirname, "./src/layout"),
        // "@context": path.resolve(__dirname, "./src/context"),
      }
    },
    server: {
      allowedHosts: [backendURL, frontendURL],
      port: 5173,
      open: true,
      host: true,
      // proxy: {
      //   "/api": {
      //     target: "http://localhost:3000",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //   },
      // },
    },
  })
} 
