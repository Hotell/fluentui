declare module 'lerna/utils' {
  import { type ProjectGraph, type ProjectGraphDependency, type ProjectGraphProjectNode } from '@nx/devkit';
  function detectProjects(): Promise<{
    projectGraph: ProjectGraphWithPackages;
    projectFileMap: Record<string, string[]>;
  }>;

  interface ProjectGraphWithPackages extends ProjectGraph {
    nodes: Record<string, ProjectGraphProjectNodeWithPackage>;
    localPackageDependencies: Record<string, ProjectGraphWorkspacePackageDependency[]>;
  }

  interface Package {
    get location(): string;
    get(key: 'main' | 'version'): string;
  }
  interface ExtendedNpaResult {}
  interface ProjectGraphProjectNodeWithPackage extends ProjectGraphProjectNode {
    package: Package | null;
  }
  interface ProjectGraphWorkspacePackageDependency extends ProjectGraphDependency {
    targetVersionMatchesDependencyRequirement: boolean;
    targetResolvedNpaResult: ExtendedNpaResult;
    dependencyCollection: 'dependencies' | 'devDependencies' | 'optionalDependencies'; // lerna doesn't manage peer dependencies
  }
}
