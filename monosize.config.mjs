// @ts-check
import webpackBundler from 'monosize-bundler-webpack';
import upstashStorage from 'monosize-storage-upstash';

/** @type {import('monosize').MonoSizeConfig} */
const config = {
  repository: 'https://github.com/microsoft/fluentui',
  storage: upstashStorage({
    url: 'REST URL (UPSTASH_REDIS_REST_URL)',
    readonlyToken: 'Readonly token (UPSTASH_REDIS_REST_TOKEN)',
  }),
  bundler: webpackBundler(config => {
    return config;
  }),
};

export default config;
