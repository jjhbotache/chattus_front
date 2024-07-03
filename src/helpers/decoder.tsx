import CryptoJS from 'crypto-js';
export default function decoder(encodedText:string,password:string): string{
  return CryptoJS.AES.decrypt(encodedText, password).toString(CryptoJS.enc.Utf8);
};