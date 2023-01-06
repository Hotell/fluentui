// @ts-check

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const tree = [
  '@fluentui/tokens',
  '@fluentui/react-theme',
  '@fluentui/keyboard-keys',
  '@fluentui/react-utilities',
  '@fluentui/react-text',
];

const compiledFileCheckPath = path.join(
  __dirname,
  'packages/react-components/react-text/lib/components/Body1/Body1.js',
);
function runTs() {
  execSync('rm -rf packages/tokens/lib{,-commonjs}');

  tree.forEach(package => {
    console.log(`Building for ${package}:`);
    const cmds = [
      `rm -rf packages/react-components/${package.replace('@fluentui/', '')}/lib{,-commonjs}`,
      `yarn workspace ${package} just-scripts ts`,
    ];
    cmds.forEach(cmd => {
      console.log(cmd);
      execSync(cmd);
    });
  });

  console.log(fs.readFileSync(compiledFileCheckPath, 'utf-8'));
  console.log('done');
}

function runSwc() {
  execSync('rm -rf packages/tokens/lib{,-commonjs}');
  tree.forEach(package => {
    const cmds = [
      `rm -rf packages/react-components/${package.replace('@fluentui/', '')}/lib{,-commonjs}`,
      `yarn workspace ${package} swc src -d ./lib -C module.type=es6`,
      `yarn workspace ${package} swc src -d ./lib-commonjs -C module.type=commonjs`,
      `yarn workspace ${package} just-scripts babel:postprocess`,
    ];

    console.log(`Building for ${package}:`);
    cmds.forEach(cmd => {
      console.log(cmd);
      execSync(cmd);
    });
  });

  // console.log(fs.readFileSync(compiledFileCheckPath, 'utf-8'));
  console.log('done');
}

// runTs();
runSwc();
