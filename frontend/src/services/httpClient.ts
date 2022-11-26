import axios, { AxiosInstance } from 'axios';
import { parseCookies } from 'nookies';

interface HttpClientType {
  httpClient: AxiosInstance;
  token: string;
}

export function httpClient(ctx?: any): HttpClientType {
  const { token } = parseCookies(ctx);

  const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  });

  return { httpClient, token };
}
