import CryptoJS from 'crypto-js';

// Use a strong secret key. In production, this should be in .env
// For this mock, we use a hardcoded fallback if env is missing.
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'my-super-secret-key-salt-2024';

export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};

export const decryptData = (ciphertext: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
