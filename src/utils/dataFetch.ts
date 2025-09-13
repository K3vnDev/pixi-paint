export interface Params<T> {
  url: string
  json?: any
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  options?: RequestInit
  onSuccess?: (data: T, message?: string, status?: number) => void
  onError?: (message?: string, status?: number) => void
  onFinish?: () => void
}

interface JSONResponse<T> {
  success: boolean
  data: T
  message?: string
}

/**
 * A utility function to fetch data from an API endpoint with built-in error handling and callbacks.
 * @param url - The API endpoint URL.
 * @param json - The JSON body to send with the request (for POST, PUT, etc.).
 * @param method - The HTTP method to use (default is 'GET').
 * @param options - Additional fetch options (this will override default options).
 * @param onSuccess - Callback function to execute on a successful response.
 * @param onError - Callback function to execute on an error response.
 * @param onFinish - Callback function to execute after the request completes (regardless of success or failure).
 * @returns A promise that resolves to the fetched data or undefined in case of an error.
 */

export const dataFetch = async <T>({
  url,
  json,
  method = 'GET',
  options,
  onSuccess = () => {},
  onError = () => {},
  onFinish = () => {}
}: Params<T>): Promise<T | undefined> => {
  try {
    const body = json ? JSON.stringify(json) : undefined
    const headers = { 'Content-Type': 'application/json' }

    const res = await fetch(url, { method, body, headers, ...options })
    const { success, data, message } = (await res.json()) as JSONResponse<T>

    if (!success || !res.ok) {
      onError(message, res.status)
      return
    }
    onSuccess(data, message, res.status)
    return data
  } catch (err) {
    onError(err as string)
  } finally {
    onFinish()
  }
}
