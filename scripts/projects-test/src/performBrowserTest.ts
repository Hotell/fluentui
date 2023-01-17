import http from 'http';
import { AddressInfo } from 'net';

import { launch, visitUrl } from '@fluentui/scripts-puppeteer';
import express from 'express';

const SERVER_HOST = 'localhost';

function startServer(publicDirectory: string, listenPort: number) {
  return new Promise<http.Server>((resolve, reject) => {
    try {
      const app = express();
      app.use(express.static(publicDirectory));

      const server = app.listen(listenPort, SERVER_HOST, () => {
        resolve(server);
      });

      server.on('error', err => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - improper Error type in typings -> https://nodejs.org/api/net.html#serverlisten
        if (err.code === 'EADDRINUSE') {
          console.error('express: Address in use ...', { listenPort, SERVER_HOST });
        }

        throw err;
      });
    } catch (err) {
      reject(err);
    }
  });
}

export async function performBrowserTest(publicDirectory: string) {
  /**
   * If port is omitted or is 0, the operating system will assign an arbitrary unused port, which can be retrieved by using server.address().port after the 'listening' event has been emitted.
   * @see https://nodejs.org/api/net.html#serverlisten
   */
  const PORT = 0;
  let server: http.Server | null;

  try {
    console.log('express: starting server');
    server = await startServer(publicDirectory, PORT);
  } catch (err) {
    console.error('express: start failed!');
    console.error(err);
    throw err;
  }

  const { port } = server.address() as AddressInfo;

  console.log(`express: server running on port "${port}" from directory "${publicDirectory}"`);

  // const options = safeLaunchOptions();
  // let browser: puppeteer.Browser | undefined;
  // let attempt = 1;
  // while (!browser) {
  //   try {
  //     browser = await puppeteer.launch(options);
  //     console.log('Launched Puppeteer');
  //   } catch (err) {
  //     if (attempt === 5) {
  //       console.error(`Puppeteer failed to launch after 5 attempts`);
  //       throw err;
  //     }
  //     console.warn('Puppeteer failed to launch (will retry):');
  //     console.warn(err);
  //     attempt++;
  //   }
  // }

  const browser = await launch();

  const page = await browser.newPage();
  let error: Error | undefined;

  page.on('console', message => {
    if (message.type() === 'error') {
      error = new Error(`[Browser]: console.error(${message.text()})`);
    }
  });
  page.on('pageerror', pageError => {
    error = pageError;
  });

  const url = `http://${SERVER_HOST}:${port}`;
  await visitUrl(page, url);

  await page.close();
  await browser.close();
  // await new Promise(resolve => server.close(resolve));
  server.close();

  if (error) {
    throw error;
  }
}
