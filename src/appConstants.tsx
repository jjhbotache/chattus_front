const realApiUrl = 'chattus-back.onrender.com';
const devApiUrl = 'localhost:8000';

export const apiUrl = import.meta.env.MODE === 'development' ? devApiUrl : realApiUrl;