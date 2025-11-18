import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const basePlugins = [
  resolve({
    browser: true,
  }),
  commonjs(),
];

// Terser options for production builds
const terserOptions = {
  compress: {
    drop_console: false,
    drop_debugger: true,
    pure_funcs: ['console.debug', 'console.trace'],
    passes: 2,
  },
  mangle: {
    toplevel: true,
    properties: {
      regex: /^_/,
    },
  },
  format: {
    comments: false,
  },
  ecma: 2020,
  module: true,
};

// Core library build (ESM + CJS)
const coreBuild = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
    }),
    terser(terserOptions),
  ],
};

// React component build (ESM + CJS)
const reactBuild = {
  input: 'src/react/MasonEffect.tsx',
  output: [
    {
      file: 'dist/react/MasonEffect.mjs',
      format: 'es',
    },
    {
      file: 'dist/react/MasonEffect.cjs',
      format: 'cjs',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react',
      rootDir: 'src',
    }),
    terser(terserOptions),
  ],
};

// React index build (for type exports)
const reactIndexBuild = {
  input: 'src/react/index.ts',
  output: [
    {
      file: 'dist/react/index.mjs',
      format: 'es',
    },
    {
      file: 'dist/react/index.cjs',
      format: 'cjs',
    },
  ],
  external: ['react', 'react-dom', './MasonEffect'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react',
      rootDir: 'src',
      declarationMap: false,
    }),
  ],
};

// Vue component is built separately using Vite (see vite.config.ts)
// This is because Vue SFC compilation requires @vitejs/plugin-vue

export default [
  coreBuild,
  reactBuild,
  reactIndexBuild,
];
