import CryptoJS from 'crypto-js';
export default function encoder(text:string,password:string): string{
  return CryptoJS.AES.encrypt(text, password).toString();
};

