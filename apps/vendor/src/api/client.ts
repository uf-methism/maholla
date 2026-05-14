// Mohalla Vendor App — API Client
// Thin wrapper around fetch for calling the backend API.
// In development, points to localhost. In production, points to Render deployment.

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

type ApiResult<T> = ApiResponse<T> | ApiError;

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return (await response.json()) as ApiResult<T>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Could not connect to server. Check your internet connection.',
      },
    };
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
