export function isObject(data: any) {
  if (data == null) {
    return false;
  }
  return typeof data == 'object';
}
