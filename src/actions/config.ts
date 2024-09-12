'use server';

export async function getConfig(key: string): Promise<string> {
  const val = process.env[`NEXT_PUBLIC_${key}`];
  console.debug(`getConfig : ${key} = ${val}`);
  if (!val) {
    return '';
  } else {
    return val;
  }
}
