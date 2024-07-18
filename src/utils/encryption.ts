import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

export const encrypt = (text: string): string => {
  const iv = randomBytes(8).toString('hex');
  const key = process.env.ENCRYPTION_SECRET;
  if (!key) {
    throw 'Configuration error: key not set';
  }
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext =
    cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
  const encrypted = `${ciphertext};${iv}`;
  return Buffer.from(encrypted).toString('base64');
};

export const decrypt = (encrypted: string): string => {
  const utf8ciphertext = Buffer.from(encrypted, 'base64').toString();
  const [data, iv] = utf8ciphertext.split(';');
  if (!data || !iv) {
    throw 'Encrypted data is not formatted correctly!';
  }
  const key = process.env.ENCRYPTION_SECRET;
  if (!key) {
    throw 'Configuration error: key not set';
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  return decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
};
