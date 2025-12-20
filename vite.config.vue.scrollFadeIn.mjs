import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    dts({
      include: ['src/vue/scrollFadeIn/**/*.ts', 'src/vue/scrollFadeIn/**/*.vue'],
      exclude: ['src/vue/scrollFadeIn/**/*.test.*', 'src/vue/scrollFadeIn/**/*.spec.*'],
      outDir: 'dist/vue/scrollFadeIn',
      rollupTypes: true,
      compilerOptions: {
        declaration: true,
        declarationMap: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/vue/scrollFadeIn/index.ts'),
      name: 'MasonEffectVueScrollFadeIn',
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
    outDir: 'dist/vue/scrollFadeIn',
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

