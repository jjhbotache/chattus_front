const realApiUrl = 'chattus-back.onrender.com';
const devApiUrl = 'localhost:8000';


const developing = import.meta.env.MODE === 'development';
export const apiUrl = developing ? devApiUrl : realApiUrl;
export const websocketPrefix = developing ? 'ws://' : 'wss://';
export const fetchPrefix = developing ? 'http://' : 'https://';