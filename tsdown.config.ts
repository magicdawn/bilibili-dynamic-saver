import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: 'esm',
  target: 'esnext',
  clean: true,
  dts: true,
  fixedExtension: false, // use .js
})
