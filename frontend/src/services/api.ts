import axios from 'axios';

const api = axios.create({
  // TODO: Change this to the actual API URL through environment variables
  baseURL: 'http://localhost:8080/'
});

export default api;
