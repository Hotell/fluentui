import * as path from 'node:path';
import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

export type ReactVersion = '17' | '18' | '19';
export type FluentVersion = 'v8' | 'v9';
export type TestType = 'e2e' | 'unit' | 'type-check';

export interface ReactVersionTesterOptions {
  reactVersion: ReactVersion;
  fluentVersion: FluentVersion;
  testType: TestType;
  dryRun?: boolean;
  verbose?: boolean;
  keepTemp?: boolean;
}

export interface TestConfiguration {
  workspaceRoot: string;
  tempDir: string;
  reactVersion: ReactVersion;
  fluentVersion: FluentVersion;
  testType: TestType;
  packageDependencies: Record<string, string>;
  tsConfigPath: string;
  jestConfigPath?: string;
  cypressConfigPath?: string;
  inputs: string[];
}

export class ReactVersionTester {
  private config: TestConfiguration;
  private options: ReactVersionTesterOptions;

  constructor(options: ReactVersionTesterOptions) {
    this.options = options;
    this.config = this.createConfiguration(options);
  }

  async run(): Promise<void> {
    if (this.options.verbose) {
      console.log('Configuration:', this.config);
    }

    if (this.options.dryRun) {
      console.log('\n🔍 Dry run mode - showing what would be executed:\n');
      this.showDryRunOutput();
      return;
    }

    console.log(
      `\n🚀 Running ${this.options.testType} tests for React ${this.options.reactVersion} (Fluent ${this.options.fluentVersion})\n`,
    );

    try {
      await this.setupTempEnvironment();
      await this.generateConfigurations();
      await this.runTests();
    } finally {
      await this.cleanup();
    }
  }

  private createConfiguration(options: ReactVersionTesterOptions): TestConfiguration {
    const workspaceRoot = this.findWorkspaceRoot();

    // Create a unique hash based on options and timestamp to avoid conflicts
    const configHash = this.generateUniqueHash(options);
    const tempDir = path.join(
      workspaceRoot,
      'tmp',
      `react-${options.reactVersion}-v${options.fluentVersion}-tests-${configHash}`,
    );

    return {
      workspaceRoot,
      tempDir,
      reactVersion: options.reactVersion,
      fluentVersion: options.fluentVersion,
      testType: options.testType,
      packageDependencies: this.getPackageDependencies(options.reactVersion),
      tsConfigPath: path.join(tempDir, `tsconfig.react.json`),
      jestConfigPath: options.testType === 'unit' ? path.join(tempDir, `jest-react.config.js`) : undefined,
      cypressConfigPath: options.testType === 'e2e' ? path.join(tempDir, `cypress-react.config.ts`) : undefined,
      inputs: this.getInputPatterns(options.fluentVersion, options.testType),
    };
  }

  private findWorkspaceRoot(): string {
    try {
      const gitRoot = execSync('git rev-parse --show-toplevel', {
        encoding: 'utf8',
        stdio: 'pipe',
      }).trim();

      if (!gitRoot) {
        throw new Error('Git command returned empty result');
      }

      return gitRoot;
    } catch (error) {
      // Fallback to nx.json search if git fails
      let current = process.cwd();
      while (current !== path.dirname(current)) {
        if (fs.existsSync(path.join(current, 'nx.json'))) {
          return current;
        }
        current = path.dirname(current);
      }

      throw new Error('Could not find workspace root (git repository not found and nx.json not found)');
    }
  }

  private generateUniqueHash(options: ReactVersionTesterOptions): string {
    // Create a hash based on options, timestamp, and process info to ensure uniqueness
    const timestamp = Date.now().toString();
    const processId = process.pid.toString();
    const configData = JSON.stringify({
      reactVersion: options.reactVersion,
      fluentVersion: options.fluentVersion,
      testType: options.testType,
      timestamp,
      processId,
    });

    return createHash('md5').update(configData).digest('hex').substring(0, 8); // Use first 8 characters for shorter paths
  }

  private getPackageDependencies(reactVersion: ReactVersion): Record<string, string> {
    const baseDependencies = {
      tslib: '^2.1.0',
    };

    // Common testing dependencies based on React version
    const testingDependencies = this.getTestingDependencies(reactVersion, this.options.testType);

    switch (reactVersion) {
      case '17':
        return {
          ...baseDependencies,
          '@types/react': '17.0.44',
          '@types/react-dom': '17.0.15',
          '@types/react-test-renderer': '17.0.2',
          react: '17.0.2',
          'react-dom': '17.0.2',
          'react-test-renderer': '17.0.2',
          ...testingDependencies,
        };
      case '18':
        return {
          ...baseDependencies,
          '@types/react': '18.3.20',
          '@types/react-dom': '18.3.6',
          '@types/react-test-renderer': '18.3.1',
          react: '18.3.1',
          'react-dom': '18.3.1',
          'react-test-renderer': '18.3.1',
          ...testingDependencies,
        };
      case '19':
        return {
          ...baseDependencies,
          '@types/react': '19.1.1',
          '@types/react-dom': '19.1.2',
          '@types/react-test-renderer': '19.1.0',
          react: '19.1.0',
          'react-dom': '19.1.0',
          'react-test-renderer': '19.1.0',
          ...testingDependencies,
        };
      default:
        throw new Error(`Unsupported React version: ${reactVersion}`);
    }
  }

  private getTestingDependencies(reactVersion: ReactVersion, testType: TestType): Record<string, string> {
    const baseDeps: Record<string, string> = {};

    // Testing library dependencies
    if (testType === 'unit') {
      Object.assign(baseDeps, {
        jest: '^29.7.0',
        'jest-environment-jsdom': '^29.7.0',
      });
      if (reactVersion === '17') {
        Object.assign(baseDeps, {
          '@testing-library/dom': '8.11.3',
          '@testing-library/react': '12.1.2',
          '@testing-library/react-hooks': '8.0.1',
          'ts-jest': '^29.1.1',
        });
      } else {
        Object.assign(baseDeps, {
          '@testing-library/dom': '^10.1.0',
          '@testing-library/react': '^16.0.0',
          '@swc/jest': '0.2.36',
        });
      }
    }

    // Cypress dependencies (for e2e tests)
    if (testType === 'e2e') {
      if (reactVersion === '17') {
        Object.assign(baseDeps, {
          cypress: '^13.0.0',
          '@cypress/react': '8.0.0',
          'cypress-real-events': '1.13.0',
        });
      } else {
        Object.assign(baseDeps, {
          cypress: '^14.0.0',
          '@cypress/react': '9.0.1',
          'cypress-real-events': '1.14.0',
        });
      }
    }

    return baseDeps;
  }

  private getInputPatterns(fluentVersion: FluentVersion, testType: TestType): string[] {
    const workspaceRoot = '{workspaceRoot}';

    if (fluentVersion === 'v8') {
      switch (testType) {
        case 'type-check':
          return [`${workspaceRoot}/packages/react-examples/*/stories/**/index.stories.tsx`];
        case 'unit':
          return [`${workspaceRoot}/packages/react/**/*.(test|spec).tsx?`];
        case 'e2e':
          return [`${workspaceRoot}/packages/react-examples/**/*.e2e.tsx?`];
      }
    } else {
      // v9
      switch (testType) {
        case 'type-check':
          return [
            `${workspaceRoot}/packages/react-components/*/stories/**/*.stories.{ts,tsx}`,
            `!${workspaceRoot}/packages/react-components/*/stories/**/index.stories.{ts,tsx}`,
            `!${workspaceRoot}/packages/react-components/react-migration-v[80]-v9/**`,
            `!${workspaceRoot}/packages/react-components/react-[a-z]+-compat/**`,
          ];
        case 'unit':
          return [`${workspaceRoot}/packages/react-components/**/*.(test|spec).tsx?`];
        case 'e2e':
          return [
            `${workspaceRoot}/packages/react-components/**/*.cy.{ts,tsx}`,
            `!${workspaceRoot}/packages/react-components/react-migration-v[80]-v9/**`,
            `!${workspaceRoot}/packages/react-components/react-[a-z]+-compat/**`,
          ];
      }
    }
  }

  private async setupTempEnvironment(): Promise<void> {
    await fs.promises.mkdir(this.config.tempDir, { recursive: true });

    // Create package.json for the temporary environment
    const packageJson = {
      name: `react-${this.config.reactVersion}-v${this.config.fluentVersion}-tests`,
      description: `React ${this.config.reactVersion} test application and playground`,
      version: '1.0.0',
      private: true,
      dependencies: this.config.packageDependencies,
    };

    await fs.promises.writeFile(path.join(this.config.tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  }

  private async generateConfigurations(): Promise<void> {
    await this.generateTsConfig();

    if (this.config.testType === 'unit' && this.config.jestConfigPath) {
      await this.generateJestConfig();
    }

    if (this.config.testType === 'e2e' && this.config.cypressConfigPath) {
      await this.generateCypressConfig();
      await this.generateCypressTsConfig();
    }
  }

  private async generateTsConfig(): Promise<void> {
    const tsConfig = {
      compilerOptions: {
        target: 'ES2019',
        module: 'esnext',
        moduleResolution: 'node',
        lib: ['ES2019', 'dom'],
        sourceMap: true,
        strict: true,
        pretty: true,
        noEmit: true,
        isolatedModules: true,
        importHelpers: true,
        jsx: 'react',
        noUnusedLocals: false,
        preserveConstEnums: true,
        skipLibCheck: true,
        typeRoots: ['./node_modules/@types'],
        types: [],
        baseUrl: '.',
        paths: {
          'react/jsx-runtime': ['./node_modules/@types/react/jsx-runtime.d.ts'],
          react: ['./node_modules/@types/react/index.d.ts'],
          'react-dom': ['./node_modules/@types/react-dom/index.d.ts'],
        },
      },
      exclude: this.getTsConfigExcludes(),
      include: this.getTsConfigIncludes(),
      files: ['../../typings/static-assets/index.d.ts'],
    };

    await fs.promises.writeFile(this.config.tsConfigPath, JSON.stringify(tsConfig, null, 2));
  }

  private getTsConfigExcludes(): string[] {
    if (this.config.fluentVersion === 'v8') {
      return [
        '../../packages/react-examples/**/index.stories.tsx',
        '../../packages/react-examples/**/index.stories.ts',
      ];
    } else {
      return [
        '../../packages/react-components/**/index.stories.tsx',
        '../../packages/react-components/**/index.stories.ts',
        '../../packages/react-components/react-migration-v0-v9/**',
        '../../packages/react-components/react-migration-v8-v9/library/**/*.spec.tsx',
        '../../packages/react-components/react-migration-v8-v9/library/**/*.test.tsx',
        '../../packages/react-components/react-migration-v8-v9/library/src/testing/**',
      ];
    }
  }

  private getTsConfigIncludes(): string[] {
    if (this.config.fluentVersion === 'v8') {
      return [
        '../../packages/react-examples/*/stories/**/*.stories.tsx',
        '../../packages/react-examples/*/stories/**/*.stories.ts',
      ];
    } else {
      return [
        '../../packages/react-components/*/stories/**/*.stories.tsx',
        '../../packages/react-components/*/stories/**/*.stories.ts',
        '../../packages/react-components/react-migration-v8-v9/stories/**/index.tsx',
        '../../packages/react-components/react-migration-v8-v9/library/**/*.tsx',
        '../../packages/react-components/react-migration-v8-v9/library/**/*.ts',
      ];
    }
  }

  private async generateJestConfig(): Promise<void> {
    if (!this.config.jestConfigPath) return;

    const jestConfig = `
// @ts-check
const fs = require('node:fs');
const path = require('node:path');

const { pathsToModuleNameMapper } = require('ts-jest');
const tsConfigBase = require('../../tsconfig.base.json');
const tsPathAliases = pathsToModuleNameMapper(tsConfigBase.compilerOptions.paths, {
  prefix: \`<rootDir>/../../\`,
});

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = {
  displayName: 'react-${this.config.reactVersion}-tests-${this.config.fluentVersion}-integration',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    ...tsPathAliases,
    '^react$': path.resolve(__dirname, './node_modules/react'),
    '^react-dom$': path.resolve(__dirname, './node_modules/react-dom'),
    '^react/jsx-runtime$': path.resolve(__dirname, './node_modules/react/jsx-runtime'),
    '^@types/react$': path.resolve(__dirname, './node_modules/@types/react'),
    '^@types/react-dom$': path.resolve(__dirname, './node_modules/@types/react-dom'),
  },
  roots: createRoots(),
  workerIdleMemoryLimit: '1024MB',
  setupFilesAfterEnv: [
    '<rootDir>/../../scripts/jest/src/setupTests.js',
  ],
  testMatch: [
    '<rootDir>/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.spec.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      tsconfig: {
        target: 'ES2019',
        module: 'commonjs',
        moduleResolution: 'node',
        lib: ['ES2019', 'dom'],
        strict: true,
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        skipLibCheck: true,
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@fluentui|@griffel)/)',
  ],
};

module.exports = config;

function createRoots() {
  const rootDir = path.resolve(__dirname, '../../packages/${
    this.config.fluentVersion === 'v8' ? 'react' : 'react-components'
  }');

  if (!fs.existsSync(rootDir)) {
    console.warn(\`Warning: Root directory \${rootDir} does not exist\`);
    return [path.resolve(__dirname, './')];
  }

  // For integration tests, scan for valid packages similar to existing jest configs
  const validPaths = findValidPackagePaths(rootDir);
  console.info(\`Creating Jest Testing roots: \${validPaths.join(', ')}\`);

  return validPaths.length > 0 ? validPaths : [rootDir];
}

function findValidPackagePaths(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    let validPaths = [];

    // Check if current directory is a valid package
    if (isValidPackage(dirPath)) {
      validPaths.push(dirPath);
    }

    // Recursively check subdirectories
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const subDirPath = path.join(dirPath, entry.name);
        validPaths = validPaths.concat(findValidPackagePaths(subDirPath));
      }
    }

    return validPaths;
  } catch (error) {
    console.warn(\`Warning: Could not scan directory \${dirPath}: \${error.message}\`);
    return [];
  }
}

function isValidPackage(dirPath) {
  try {
    const packageJsonPath = path.join(dirPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Skip if package is private or has excluded tags
    if (packageJson.private === true) {
      return false;
    }

    // Skip migration, compat, and story packages for unit tests
    if (packageJson.name && (
      packageJson.name.includes('-migration-') ||
      packageJson.name.includes('-compat') ||
      packageJson.name.includes('-stories')
    )) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
`;

    await fs.promises.writeFile(this.config.jestConfigPath, jestConfig);
  }

  private async generateCypressConfig(): Promise<void> {
    if (!this.config.cypressConfigPath) return;

    const cypressConfig = `
import * as path from 'path';
import { baseConfig } from '@fluentui/scripts-cypress';

const excludedSpecs = [
  '!' + path.resolve('../../packages/${
    this.config.fluentVersion === 'v8' ? 'react' : 'react-components'
  }/*-compat/src/**/*.cy.{tsx,ts}'),
  '!' + path.resolve('../../packages/${
    this.config.fluentVersion === 'v8' ? 'react' : 'react-components'
  }/*-migration-*/src/**/*.cy.{tsx,ts}'),
];

const specs = [
  path.resolve('./src/**/*.cy.{tsx,ts}'),
  path.resolve('../../packages/${
    this.config.fluentVersion === 'v8' ? 'react' : 'react-components'
  }/**/src/**/*.cy.{tsx,ts}'),
  ${
    this.config.fluentVersion === 'v9'
      ? `path.resolve('../../packages/react-components/react-tabster/src/**/*.cy.{tsx,ts}'),`
      : ''
  }
  ...excludedSpecs,
];

const config = { ...baseConfig };
config.component.specPattern = specs;
config.component.devServer.webpackConfig.resolve ??= {};
config.component.devServer.webpackConfig.resolve.alias = {
  ...config.component.devServer.webpackConfig.resolve.alias,
  ${
    this.config.reactVersion === '17'
      ? `
  // For React 17, we may need different Cypress React adapter setup
  '@cypress/react': path.resolve(__dirname, './node_modules/@cypress/react'),`
      : `
  '@cypress/react': path.resolve(__dirname, './node_modules/@cypress/react'),`
  }
  '@types/react': path.resolve(__dirname, './node_modules/@types/react'),
  '@types/react-dom': path.resolve(__dirname, './node_modules/@types/react-dom'),
  react: path.resolve(__dirname, './node_modules/react'),
  'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
  'cypress-real-events': path.resolve(__dirname, './node_modules/cypress-real-events'),
};

// Set up proper module resolution for the React version being tested
config.component.devServer.webpackConfig.module ??= {};
config.component.devServer.webpackConfig.module.rules ??= [];

// Ensure TypeScript files are handled correctly
config.component.devServer.webpackConfig.module.rules.push({
  test: /\\.(ts|tsx)$/,
  use: [
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        compilerOptions: {
          jsx: 'react-jsx',
          target: 'ES2019',
          module: 'esnext',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          skipLibCheck: true,
        },
      },
    },
  ],
});

/**
 * Resolve the support file and index.html file paths
 * This is a workaround for the issue where Cypress does not resolve the paths correctly, as it
 * internally prepend the __dirname, making them invalid.
 */
config.component.supportFile = path.normalize('../../scripts/cypress/src/support/component.js');
config.component.indexHtmlFile = path.normalize('../../scripts/cypress/src/support/component-index.html');

export default config;
`;

    await fs.promises.writeFile(this.config.cypressConfigPath, cypressConfig);
  }

  private async generateCypressTsConfig(): Promise<void> {
    const cypressTsConfig = {
      extends: './tsconfig.react.json',
      compilerOptions: {
        isolatedModules: false,
        types: ['cypress', 'node'],
        skipLibCheck: true,
      },
      include: [
        'src/**/*.cy.ts',
        'src/**/*.cy.tsx',
        '../../packages/react-components/**/src/**/*.cy.ts',
        '../../packages/react-components/**/src/**/*.cy.tsx',
        '../../scripts/cypress/src/support/component.ts',
      ],
      exclude: ['../../packages/react-components/*-compat/**', '../../packages/react-components/*-migration-*/**'],
    };

    const cypressTsConfigPath = path.join(this.config.tempDir, 'tsconfig.cy.json');
    await fs.promises.writeFile(cypressTsConfigPath, JSON.stringify(cypressTsConfig, null, 2));
  }

  private async runTests(): Promise<void> {
    const commands = this.getTestCommands();

    for (const command of commands) {
      console.log(`🔧 Running: ${command}`);

      try {
        const result = execSync(command, {
          cwd: this.config.tempDir,
          stdio: this.options.verbose ? 'inherit' : 'pipe',
          env: { ...process.env, NODE_ENV: 'test' },
          encoding: 'utf8',
          maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
        });

        if (!this.options.verbose && result) {
          console.log(
            '📄 Command output:',
            result.slice(0, 1000) + (result.length > 1000 ? '...\n(truncated for display)' : ''),
          );
        }
        console.log('✅ Command completed successfully');
      } catch (error: any) {
        console.error('❌ Command failed:', command);

        if (error.stdout) {
          console.error('📤 STDOUT:');
          console.error(error.stdout.toString());
        }

        if (error.stderr) {
          console.error('📥 STDERR:');
          console.error(error.stderr.toString());
        }

        if (error.status) {
          console.error('🔢 Exit code:', error.status);
        }

        throw new Error(`Command "${command}" failed with exit code ${error.status || 'unknown'}`);
      }
    }
  }

  private getTestCommands(): string[] {
    const commands = ['yarn install'];

    switch (this.config.testType) {
      case 'type-check':
        commands.push(`npx tsc -p tsconfig.react.json --noEmit`);
        break;
      case 'unit':
        commands.push(`npx jest --passWithNoTests -c jest-react.config.js`);
        break;
      case 'e2e':
        // Use the appropriate Cypress version for the React version
        if (this.config.reactVersion === '17') {
          commands.push(`npx cypress@13 run --component --config-file cypress-react.config.ts`);
        } else {
          commands.push(`npx cypress@14 run --component --config-file cypress-react.config.ts`);
        }
        break;
    }

    return commands;
  }

  private showDryRunOutput(): void {
    console.log('📁 Temporary directory:', this.config.tempDir);
    console.log('📦 Package dependencies:', this.config.packageDependencies);
    console.log('🔧 Test commands:');

    this.getTestCommands().forEach(cmd => {
      console.log(`  ${cmd}`);
    });

    console.log('\n📄 Configuration files that would be generated:');
    console.log(`  - ${this.config.tsConfigPath}`);

    if (this.config.jestConfigPath) {
      console.log(`  - ${this.config.jestConfigPath}`);
    }

    if (this.config.cypressConfigPath) {
      console.log(`  - ${this.config.cypressConfigPath}`);
    }
  }

  private async cleanup(): Promise<void> {
    if (!this.options.dryRun && !this.options.keepTemp) {
      await fs.promises.rm(this.config.tempDir, { recursive: true, force: true });
      console.log('🧹 Cleaned up temporary files');
    } else if (this.options.keepTemp) {
      console.log('🔒 Keeping temporary files for inspection:', this.config.tempDir);
    }
  }
}

export function reactVersionTester(options: ReactVersionTesterOptions): ReactVersionTester {
  return new ReactVersionTester(options);
}
