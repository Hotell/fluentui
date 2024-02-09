import {
  joinPathFragments,
  formatFiles,
  readProjectConfiguration,
  Tree,
  output,
  writeJson,
  visitNotIgnoredFiles,
  addProjectConfiguration,
  updateProjectConfiguration,
  updateJson,
  offsetFromRoot,
} from '@nx/devkit';
import { getProjectConfig } from '../../utils';
import { MigrateV9DomainsGeneratorSchema } from './schema';

export async function migrateV9DomainsGenerator(tree: Tree, options: MigrateV9DomainsGeneratorSchema) {
  const project = getProjectConfig(tree, { packageName: options.name });

  const hasStories = tree.exists(project.paths.stories);

  if (!hasStories) {
    output.logSingleLine('no stories present, bye');
    return;
  }

  const newLibRoot = joinPathFragments(project.projectConfig.root, 'library');
  const newStoriesRoot = project.paths.stories;

  // create new stories project
  setupStoriesProject(tree, { config: project, newRoot: newStoriesRoot });
  setupLibraryProject(tree, { config: project, newRoot: newLibRoot });

  await formatFiles(tree);
}

function setupLibraryProject(tree: Tree, options: { config: ReturnType<typeof getProjectConfig>; newRoot: string }) {
  const { config, newRoot } = options;
  const newProjectName = `@fluentui/${config.normalizedPkgName}`;
  const newSourceRoot = joinPathFragments(newRoot, 'src');

  updateJson(tree, config.paths.projectJson, json => {
    json.name = newProjectName;
    json.root = newRoot;
    json.sourceRoot = newSourceRoot;
    return json;
  });
  updateJson(tree, config.paths.tsconfig.main, json => {
    json.extends = `${offsetFromRoot(newRoot)}tsconfig.base.json`;
    return json;
  });

  visitNotIgnoredFiles(tree, config.projectConfig.root, p => {
    if (p.includes('stories') || p.includes('.storybook')) {
      return;
    }

    const newPath = p.replace(config.projectConfig.root, newRoot);
    tree.rename(p, newPath);
  });
}
function setupStoriesProject(tree: Tree, options: { config: ReturnType<typeof getProjectConfig>; newRoot: string }) {
  const { config, newRoot } = options;

  const newProjectName = `@fluentui/${config.normalizedPkgName}-stories`;
  const newSourceRoot = joinPathFragments(newRoot, 'src');

  // move to /src folder
  visitNotIgnoredFiles(tree, newRoot, p => {
    const newPath = p.replace(config.projectConfig.root, newSourceRoot);
    tree.rename(p, newPath);
  });

  addProjectConfiguration(tree, newProjectName, {
    root: newRoot,
    sourceRoot: newSourceRoot,
    projectType: 'library',
    tags: ['vNext', 'platform:web'],
  });
  writeJson(tree, joinPathFragments(newRoot, 'package.json'), {
    name: newProjectName,
    version: '9.0.0',
    private: true,
    scripts: {
      storybook: 'start-storybook',
    },
    dependencies: {
      '@fluentui/react-components': '*',
    },
    devDependencies: {
      '@fluentui/scripts-tasks': '*',
    },
  });
  writeJson(tree, joinPathFragments(newRoot, 'tsconfig.json'), { extends: '' });
  tree.rename(config.paths.storybook.rootFolder, joinPathFragments(newRoot, '.storybook'));
}

export default migrateV9DomainsGenerator;
