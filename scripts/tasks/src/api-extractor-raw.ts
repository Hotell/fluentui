import * as path from 'node:path';

import { Extractor, ExtractorConfig, ExtractorResult } from '@microsoft/api-extractor';

export function apiExtractorRaw() {
  performance.mark('apiExtractorRaw:start');
  const root = process.cwd();
  const apiExtractorJsonPath = path.join(root, './config/api-extractor.json');

  // Load and parse the api-extractor.json file
  const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);

  // Invoke API Extractor
  const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
    // Equivalent to the "--local" command-line parameter
    localBuild: false,

    // Equivalent to the "--verbose" command-line parameter
    showVerboseMessages: false,
  });

  if (extractorResult.succeeded) {
    performance.mark('apiExtractorRaw:end');
    console.log(performance.measure('apiExtractorRaw', 'apiExtractorRaw:start', 'apiExtractorRaw:end'));

    console.log(`API Extractor completed successfully`);
    // process.exitCode = 0;
    return;
  }

  console.error(
    `API Extractor completed with ${extractorResult.errorCount} errors` +
      ` and ${extractorResult.warningCount} warnings`,
  );
  process.exitCode = 1;
}
