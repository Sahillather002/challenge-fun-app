import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export type GetTokenFn = () => Promise<string | null | undefined>;

export class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, private getToken?: GetTokenFn) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(async (config) => {
      if (this.getToken) {
        try {
          const token = await this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.warn('Auth interceptor failed:', e);
        }
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response.data, // Automatically return data to match startup patterns
      (error) => {
        if (error.response?.status === 401) {
          // Global logout event could be triggered here
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T>(url, config) as any;
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config) as any;
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config) as any;
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T>(url, config) as any;
  }
}
