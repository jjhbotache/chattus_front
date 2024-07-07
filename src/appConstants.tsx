import { getMaxLocalStorageSize } from "./helpers/localStorageFunctions";

const realApiUrl = 'chattus-back.onrender.com';
const devApiUrl = 'localhost:8000';


const developing = import.meta.env.MODE === 'development';
const apiUrl = developing ? devApiUrl : realApiUrl;
const websocketPrefix = developing ? 'ws://' : 'wss://';
const fetchPrefix = developing ? 'http://' : 'https://';
export const fetchAPI = fetchPrefix + apiUrl;
export const websocketAPI = websocketPrefix + apiUrl + '/ws';


// clean all localStorage
localStorage.clear();
export const maxLocalStorageSize = getMaxLocalStorageSize();