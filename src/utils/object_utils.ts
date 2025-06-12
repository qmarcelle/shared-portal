/* eslint-disable @typescript-eslint/no-explicit-any */
export function isObject(data: any) {
  if (data == null) {
    return false;
  }
  return typeof data == 'object';
}

export function isObjectEmpty(data: any): boolean {
  if (data === undefined || data === null) {
    return true;
  }

  if (!isObject(data)) {
    return true;
  }
  return Object.keys(data).every(
    (key) => data[key] === '' || data[key] == null,
  );
}

/**
 * Groups an array of objects by a specified key.
 * @param data - The array of objects to group.
 * @param key - The key to group by.
 * @returns A record where the keys are the group identifiers and the values are arrays of objects.
 */
export function groupByKey<T extends Record<string, any>>(
  data: T[],
  key: keyof T,
): Record<string, T[]> {
  return data.reduce(
    (acc, item) => {
      const groupKey = item[key] as string;

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }

      acc[groupKey].push(item);

      return acc;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Filters an array of objects to ensure uniqueness based on specified attributes.
 * @param data - The array of objects to filter.
 * @param attributes - The array of attributes to compare for uniqueness.
 * @returns A filtered array with unique objects based on the specified attributes.
 */
export function filterUniqueByAttributes<T extends Record<string, any>>(
  data: T[],
  attributes: (keyof T)[],
): T[] {
  return data.filter(
    (item, index, self) =>
      index ===
      self.findIndex((otherItem) =>
        attributes.every((attr) => otherItem[attr] === item[attr]),
      ),
  );
}

export function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
