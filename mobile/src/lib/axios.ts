import axios from "axios"

export const api = axios.create({
  baseURL: 'http://192.168.237.186:3333'
})