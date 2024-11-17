
const realApiUrl = 'chattus-back.onrender.com';
const devApiUrl = 'localhost:8000';


const developing = import.meta.env.MODE === 'development';
// const developing = false
const apiUrl = developing ? devApiUrl : realApiUrl;
const websocketPrefix = developing ? 'ws://' : 'wss://';
const fetchPrefix = developing ? 'http://' : 'https://';
export const fetchAPI = fetchPrefix + apiUrl;
export const websocketAPI = websocketPrefix + apiUrl + '/ws';
