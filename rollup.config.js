//https://devhints.io/rollup
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

// export default {
//     entry: 'src/index.js',
//     // format: 'umd',
//     output: {
//         file: 'dist/bundle.js',
//         format: 'cjs'
//     },
//     // external: ['bluebird', 'knex', 'node-gyp', 'fsevents'],
//     plugins: [
//       json(),
//       babel({
//         exclude: [
//             'node_modules/**',
//             '*.json'
//         ]
//         // babelrc: false,
//         // presets: ['react', 'es2015-rollup', 'stage-0'],
//         // plugins: ['transform-decorators-legacy']
//       })
//     //   nodeResolve({ jsnext: true, main: true}),
//     //   commonjs()
//     ]
//   };

export default {
    input: 'src/index.js',
    plugins: [
        json(),
        babel({
          exclude: [
              'node_modules/**',
              '*.json'
          ]
        })
    ],
    output: {
      file: 'dist/bundle.js',
      format: 'cjs'
    }
  };
