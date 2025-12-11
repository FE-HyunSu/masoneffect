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
      include: ['src/svelte/textToParticle/**/*.ts', 'src/svelte/textToParticle/**/*.svelte'],
      exclude: ['src/svelte/textToParticle/**/*.test.*', 'src/svelte/textToParticle/**/*.spec.*'],
      outDir: 'dist/svelte/textToParticle',
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
      entry: resolve(import.meta.dirname, 'src/svelte/textToParticle/index.ts'),
      name: 'MasonEffectSvelteTextToParticle',
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
    outDir: 'dist/svelte/textToParticle',
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

