import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('当前环境模式', mode)
  const env = loadEnv(mode, process.cwd()); //获取当前环境变量（开发，测试，生产）
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: "./src/mock",//mock文件地址
        enable: command === "serve",//开发环境下run dev的值,生产环境是build
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: false,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_SERVE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mock/, 'api'),
        }
      }

    }
  }
})
