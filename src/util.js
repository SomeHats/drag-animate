// @flow
let i = 0;
export opaque type ID = string;
export const genId = (): ID =>
  `${Date.now().toString(36)}.${(i++).toString(36)}`;
