import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { migrateV9DomainsGenerator } from './generator';
import { MigrateV9DomainsGeneratorSchema } from './schema';

describe('migrate-v9-domains generator', () => {
  let tree: Tree;
  const options: MigrateV9DomainsGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await migrateV9DomainsGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
