const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const swc = require('@swc/core');

main();
function main() {
  execSync('SPACK_MODE=app spack');

  const paths = {
    menu: path.join(__dirname, 'dist/bundle-size-swc/Menu.fixture.js'),
    menuSelectable: path.join(__dirname, 'dist/bundle-size-swc/Menu.Selectable.fixture.js'),
  };

  Object.values(paths).forEach(fixturePath => {
    const newFixturePath = fixturePath.replace('fixture', 'output');
    const newFixtureMinPath = newFixturePath.replace('output', 'min');

    fs.renameSync(fixturePath, newFixturePath);

    fs.writeFileSync(
      newFixtureMinPath,
      swc.minifySync(fs.readFileSync(newFixturePath, 'utf-8'), {
        compress: true,
        mangle: true,
      }).code,
      'utf-8',
    );
  });
}
