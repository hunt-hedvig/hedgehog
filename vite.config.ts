import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginNode } from 'vite-plugin-node'

export default defineConfig({
  server: {
    // vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
    port: 9000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'koa',
      appPath: './src/server/entry.ts',
      exportName: 'server',
      tsCompiler: 'esbuild',
    }),
    react(),
  ],
  root: './src/',
  resolve: {
    alias: {
      apollo: './src/apollo',
      portals: './src/portals',
      '@hedvig-ui': './shared/@hedvig-ui',
      auth: './src/auth',
    },
  },
})
