#!/usr/bin/env node

// @ts-check

const { joinPathFragments } = require('@nx/devkit');
const { registerTsProject } = require('@nx/js/src/internal');

registerTsProject(joinPathFragments(__dirname, '..', 'tsconfig.lib.json'));

// This will be used for publishing the package
// const { run } = require('../dist/src/lib/cli.js');

// we are using in memory TSC to JS transpilation, so we can use the source directly.
const { run } = require('../src/lib/cli');

run().catch(error => {
  console.error('Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
