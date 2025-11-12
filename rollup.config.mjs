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

// 강력한 난독화 옵션
const terserOptions = {
  compress: {
    drop_console: false, // console은 유지 (디버깅용)
    drop_debugger: true,
    pure_funcs: ['console.debug', 'console.trace'],
    passes: 3, // 여러 번 압축하여 더 강력한 최적화
    unsafe: true,
    unsafe_comps: true,
    unsafe_math: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_undefined: true,
  },
  mangle: {
    toplevel: true, // 최상위 레벨 변수명도 난독화
    properties: {
      regex: /^_/, // _로 시작하는 속성만 난독화 (일반 속성은 유지)
    },
    keep_classnames: false, // 클래스명도 난독화
    keep_fnames: false, // 함수명도 난독화
  },
  format: {
    comments: false, // 주석 제거
    ascii_only: false, // 유니코드 문자 허용 (더 강력한 난독화)
  },
  ecma: 2020,
  module: true,
};

// 코어 라이브러리 빌드 (개발용 - 소스맵 포함)
const coreBuildDev = {
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
  ],
};

// 코어 라이브러리 빌드 (프로덕션용 - min + 난독화)
const coreBuildProd = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.min.js',
      format: 'cjs',
      sourcemap: false, // min 파일은 소스맵 제거
    },
    {
      file: 'dist/index.esm.min.js',
      format: 'esm',
      sourcemap: false,
    },
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'MasonEffect',
      sourcemap: false,
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false, // min 파일은 타입 정의 불필요
      declarationMap: false,
      sourceMap: false,
      rootDir: 'src',
    }),
    terser(terserOptions),
  ],
};

// React 컴포넌트 빌드 (개발용)
const reactBuildDev = {
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
  ],
};

// React 컴포넌트 빌드 (프로덕션용 - min + 난독화)
const reactBuildProd = {
  input: 'src/react/MasonEffect.tsx',
  output: [
    {
      file: 'dist/react/MasonEffect.min.js',
      format: 'esm',
      sourcemap: false,
    },
    {
      file: 'dist/react/MasonEffect.min.cjs',
      format: 'cjs',
      sourcemap: false,
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      rootDir: 'src',
    }),
    terser(terserOptions),
  ],
};

// Vue 컴포넌트는 빌드하지 않고 소스 그대로 사용
// (Vue 프로젝트에서 직접 컴파일)

export default [
  coreBuildDev,
  coreBuildProd,
  reactBuildDev,
  reactBuildProd,
];

