import { useState, useCallback } from 'react';
import { askAi } from '../services/api';

/**
 * Custom hook that manages the async lifecycle (idle/loading/success/error)
 * for calling the AI endpoint. Returns an execute function and state values.
 *
 * @returns {{ execute: (prompt: string) => Promise<string>, data: string|null, error: string|null, status: string, isLoading: boolean, reset: () => void }}
 */
export function useAskAi() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (prompt) => {
    setStatus('loading');
    setError(null);

    try {
      const response = await askAi(prompt);
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong. Please try again.';
      setError(message);
      setStatus('error');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return { execute, data, error, status, isLoading: status === 'loading', reset };
}
