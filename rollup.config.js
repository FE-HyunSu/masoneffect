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

// 코어 라이브러리 빌드
const coreBuild = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'MasonEffect',
      sourcemap: true,
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
    terser(),
  ],
};

// React 컴포넌트 빌드
const reactBuild = {
  input: 'src/react/MasonEffect.tsx',
  output: [
    {
      file: 'dist/react/MasonEffect.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/react/MasonEffect.cjs',
      format: 'cjs',
      sourcemap: true,
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
    terser(),
  ],
};

// Vue 컴포넌트는 빌드하지 않고 소스 그대로 사용
// (Vue 프로젝트에서 직접 컴파일)

export default [coreBuild, reactBuild];

