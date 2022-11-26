import type { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';

import { httpClient } from './httpClient';

interface RequestsProps {
  getRequest: <T>(url: string, params?: object) => Promise<AxiosResponse<T>>;
  postRequest: <T>(
    url: string,
    params: object,
    header?: object,
  ) => Promise<AxiosResponse<T>>;
  putRequest: <T>(url: string, params: object) => Promise<AxiosResponse<T>>;
  isLoading: boolean;
}

function useRequests(): RequestsProps{
  const { httpClient: apiClient } = httpClient();
  const [isLoading, setIsLoading] = useState(false);

  const getRequest = useCallback(async <T>(url: string, params?: object) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<T>(url, params);

      return response;
    }
    catch (error) {
      throw error;
    }
    finally {
      setIsLoading(false);
    }
  }, [apiClient, setIsLoading])

  async function postRequest<T>(url: string, params: object, headers?: object) {
    try {
      setIsLoading(true);
      const response = await apiClient.request<T>({
        method: 'post',
        url,
        data: params,
        headers,
      });

      return response;
    }
    catch (error) {
      throw error;
    }
    finally {
      setIsLoading(false);
    }
  }

  async function putRequest<T>(url: string, params: object) {
    try {
      setIsLoading(true);
      const response = await apiClient.put<T>(url, params);

      return response;
    }
    catch (error) {
      throw error;
    }
    finally {
      setIsLoading(false);
    }
  }

  return { getRequest, postRequest, putRequest, isLoading };
}

export default useRequests;
