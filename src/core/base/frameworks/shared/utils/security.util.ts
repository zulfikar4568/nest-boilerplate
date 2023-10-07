import hasha from 'hasha';
import randomstring from 'randomstring';

export const rand = (len?: number): Promise<string> =>
  new Promise((res, rej) => {
    try {
      res(randomstring.generate(len || 16));
    } catch (error) {
      rej(error);
    }
  });

export const generateSalt = (): Promise<string> =>
  new Promise((res, rej) => {
    try {
      res(rand());
    } catch (error) {
      rej(error);
    }
  });

export const md5 = (plain: any): Promise<string> =>
  new Promise((res, rej) => {
    try {
      res(hasha(plain, { algorithm: 'md5' }));
    } catch (error) {
      rej(error);
    }
  });

export const sha512 = (plain: any): Promise<string> =>
  new Promise((res, rej) => {
    try {
      res(hasha(plain, { algorithm: 'sha512' }));
    } catch (error) {
      rej(error);
    }
  });
