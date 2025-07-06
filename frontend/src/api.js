import axios from 'axios'

// ✅ Use environment variable if set (on Netlify), else fallback to local
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'

console.log('📦 API Base URL:', BACKEND_URL)  // Optional: Helpful during debugging

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default api
