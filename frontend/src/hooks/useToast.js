import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'error', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback((message) => {
    return showToast(message, 'error');
  }, [showToast]);

  const showSuccess = useCallback((message) => {
    return showToast(message, 'success');
  }, [showToast]);

  const showInfo = useCallback((message) => {
    return showToast(message, 'info');
  }, [showToast]);

  return {
    toasts,
    showToast,
    showError,
    showSuccess,
    showInfo,
    removeToast,
  };
};

