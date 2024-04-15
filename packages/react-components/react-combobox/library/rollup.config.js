import { dts } from 'rollup-plugin-dts';

export default {
  input: '../../../../dist/out-tsc/types/packages/react-components/react-combobox/library/src/index.d.ts', // path to your main TypeScript file
  output: {
    file: './dist/index-rollup.d.ts', // path where the output .d.ts file will be created
    format: 'es',
  },
  plugins: [dts()],
};
