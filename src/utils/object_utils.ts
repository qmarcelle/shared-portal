/* eslint-disable @typescript-eslint/no-explicit-any */
export function isObject(data: any) {
  if (data == null) {
    return false;
  }
  return typeof data == 'object';
}

export function isObjectEmpty(data: any): boolean {
  if (!isObject(data)) {
    return true;
  }
  return Object.keys(data).every(
    (key) => data[key] === '' || data[key] == null,
  );
}
