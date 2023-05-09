#!/usr/bin/env node

// Remove for prod - START

const path = require('path');
const { workspaceRoot } = require('@nrwl/devkit');
const { registerTsProject } = require('nx/src/utils/register');

const projectRoot = path.join(workspaceRoot, 'packages/dts');
registerTsProject(projectRoot);

// Remove for prod - END

const { cli } = require('../src/index');

cli();
