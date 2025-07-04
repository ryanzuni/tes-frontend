import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://test-fe.mysellerpintar.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

