import { generateSalt, md5 } from './security.util';

export const checkPassword = async (
  plain: string,
  encryptedPassword: string,
): Promise<boolean> => {
  const passwords = encryptedPassword.split('$');

  const encrypted = passwords.slice().pop();
  const salt = passwords[1];

  const combined = await Array.from({ length: 512 }, (_, i) => i).reduce(
    async (_acc, curr) => {
      const acc = await _acc;
      if (curr === 0) {
        return await md5(`${salt}${plain}${curr}`);
      }
      return await md5(`${salt}${acc}${curr}`);
    },
    Promise.resolve(''),
  );

  return combined === encrypted;
};

export const generatePassword = async (plain: string): Promise<string> => {
  const salt = await generateSalt();

  const encrypted = await Array.from({ length: 512 }, (_, i) => i).reduce(
    async (_acc, curr) => {
      const acc = await _acc;
      if (curr === 0) {
        return await md5(`${salt}${plain}${curr}`);
      }
      return await md5(`${salt}${acc}${curr}`);
    },
    Promise.resolve(''),
  );

  const result = `md5$${salt}$${encrypted}`;

  return result;
};
