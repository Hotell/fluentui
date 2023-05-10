export const shipped = ['3.9', '4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '5.0'] as const;

export const supported = [...shipped, '5.1'] as const;

export const lowest = supported[0];
export const latest = supported[supported.length - 1];

export type TypeScriptVersion = (typeof supported)[number];

export function range(min: TypeScriptVersion): readonly TypeScriptVersion[] {
  return supported.filter(v => v >= min);
}

export function isSupported(version: string): version is TypeScriptVersion {
  return supported.indexOf(version as TypeScriptVersion) > -1;
}
