export type Logger = ReturnType<typeof createLogger>;
export function createLogger(mode: 'verbose' | 'silent') {
  const header = 'dts: ';
  const log = (...args: Parameters<typeof console.log>) => {
    mode === 'verbose' && console.log(`${header}`, ...args);
  };
  const info = (...args: Parameters<typeof console.info>) => {
    console.info(`${header}`, ...args);
  };

  const error = (...args: Parameters<typeof console.error>) => {
    console.log(`${header} ❌`, ...args);
  };

  const success = (...args: Parameters<typeof console.log>) => {
    console.log(`${header} ✅`, ...args);
  };

  return {
    log,
    info,
    error,
    success,
  };
}
