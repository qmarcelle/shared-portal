import { decrypt, encrypt } from '@/utils/encryption';

describe('Encryption Util', () => {
  it('Encryption and decryption utility should function as expected', () => {
    process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
    const plaintext = 'Hello World!';
    const encrypted = encrypt(plaintext);
    expect(encrypted).toBeDefined();
    const decrypted = decrypt(encrypted);
    expect(decrypted).toEqual(plaintext);
  });
});
