import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const root = resolve(import.meta.dirname, '../..');

export default defineConfig({
  root,
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    dts({
      include: ['src/vue/count/**/*.ts', 'src/vue/count/**/*.vue'],
      exclude: ['src/vue/count/**/*.test.*', 'src/vue/count/**/*.spec.*'],
      outDir: 'dist/vue/count',
      rollupTypes: true,
      compilerOptions: {
        declaration: true,
        declarationMap: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(root, 'src/vue/count/index.ts'),
      name: 'MasonEffectVueCount',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    outDir: 'dist/vue/count',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
  },
});
