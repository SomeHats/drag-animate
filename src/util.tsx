let i = 0;
export type ID = string;
export const genId = (): ID =>
  `${Date.now().toString(36)}.${(i++).toString(36)}`;

export type Class<T> = {
  new (...args: any[]): T;
};

export const crash = (msg: string): never => {
  throw new Error(msg);
};

export function assertExists<T>(value: T | null | void): T {
  if (value != null) return value;
  return crash('required value does not exist');
}

export const spawnUnknownSwitchCaseError = (
  type: string,
  value: never,
): Error => {
  return new Error(`Unknown ${type}: ${value}`);
};
