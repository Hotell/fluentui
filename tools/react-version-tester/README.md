# React Version Tester

A CLI tool for running React version-specific integration tests across different Fluent UI versions.

## Overview

This tool replaces the multiple separate React integration test applications (react-17-tests-v9, react-18-tests-v9, react-19-tests-v9, react-18-tests-v8) with a single, generic CLI that can dynamically configure and run integration tests for any specified React and Fluent UI version combination.

## Usage

```bash
# Run type-checking tests for React 18 with Fluent UI v9
yarn react-version-tester --baseline 18 --test-type type-check

# Run unit tests for React 17 with Fluent UI v8
yarn react-version-tester --baseline 17 --test-type unit --fluent-version v8

# Run e2e tests for React 19 with Fluent UI v9
yarn react-version-tester --baseline 19 --test-type e2e

# Dry run to see what would be executed
yarn react-version-tester --baseline 18 --test-type type-check --dry-run

# Verbose output for debugging
yarn react-version-tester --baseline 18 --test-type type-check --verbose
```

## Options

- `--baseline <version>` - React version baseline (17, 18, 19) **[Required]**
- `--test-type <type>` - Type of test to run (e2e, unit, type-check) **[Required]**
- `--fluent-version <version>` - Fluent UI version (v8, v9) **[Default: v9]**
- `--dry-run` - Show what would be executed without running tests
- `--verbose` - Enable verbose output
- `--help` - Show help information

## Supported Combinations

### React Versions

- **17**: React 17.0.2, @types/react 17.0.85
- **18**: React 18.3.1, @types/react 18.3.20
- **19**: React 19.0.1, @types/react 19.0.7

### Fluent UI Versions

- **v8**: Legacy Fluent UI packages (`@fluentui/react`)
- **v9**: Modern Fluent UI packages (`@fluentui/react-components`)

### Test Types

- **type-check**: TypeScript compilation tests
- **unit**: Jest unit tests
- **e2e**: Cypress component tests

## How It Works

1. **Environment Setup**: Creates a temporary directory with appropriate package.json and dependencies
2. **Configuration Generation**: Generates TypeScript, Jest, and/or Cypress configuration files
3. **Dependency Installation**: Installs the correct React and type definition versions
4. **Test Execution**: Runs the specified test type with the configured environment
5. **Cleanup**: Removes temporary files after completion

## Generated Files

Depending on the test type, the following configuration files are generated:

- `tsconfig.react-{version}.json` - TypeScript configuration
- `jest-react-{version}.config.js` - Jest configuration (for unit tests)
- `cypress-react-{version}.config.ts` - Cypress configuration (for e2e tests)

## Examples

### Type-checking Fluent UI v9 stories with React 18

```bash
yarn react-version-tester --baseline 18 --test-type type-check --fluent-version v9
```

### Running unit tests for legacy Fluent UI with React 17

```bash
yarn react-version-tester --baseline 17 --test-type unit --fluent-version v8
```

### E2E tests for latest React with modern Fluent UI

```bash
yarn react-version-tester --baseline 19 --test-type e2e --fluent-version v9
```

## Development

### Building the CLI

```bash
npx nx build react-version-tester
```

### Running Tests

```bash
npx nx test react-version-tester
```

### Linting

```bash
npx nx lint react-version-tester
```

## Migration from Existing Apps

This tool replaces the following applications:

- `apps/react-17-tests-v9` → `yarn react-version-tester --baseline 17 --fluent-version v9`
- `apps/react-18-tests-v8` → `yarn react-version-tester --baseline 18 --fluent-version v8`
- `apps/react-18-tests-v9` → `yarn react-version-tester --baseline 18 --fluent-version v9`
- `apps/react-19-tests-v9` → `yarn react-version-tester --baseline 19 --fluent-version v9`

The CLI provides the same functionality while being more flexible and maintainable.
