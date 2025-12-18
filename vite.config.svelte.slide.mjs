import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        css: 'external',
      },
      preprocess: sveltePreprocess(),
    }),
    dts({
      include: ['src/svelte/slide/**/*.ts', 'src/svelte/slide/**/*.svelte'],
      exclude: ['src/svelte/slide/**/*.test.*', 'src/svelte/slide/**/*.spec.*'],
      outDir: 'dist/svelte/slide',
      rollupTypes: true,
      compilerOptions: {
        declaration: true,
        declarationMap: false,
      },
      skipDiagnostics: true, // TypeScript 에러 무시 (Svelte 파일 타입 체크 스킵)
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/svelte/slide/index.ts'),
      name: 'MasonEffectSvelteSlide',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['svelte'],
      output: {
        globals: {
          svelte: 'Svelte',
        },
      },
    },
    outDir: 'dist/svelte/slide',
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

