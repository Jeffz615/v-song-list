import { useCallback, useEffect, useRef, useState } from 'react';

const TOAST_DURATION = 2600;

/** 轻量 toast：返回当前消息与触发函数，渲染交给 <Toast /> */
export function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const showToast = useCallback((message: string) => {
    window.clearTimeout(timerRef.current);
    setToastMessage(message);
    timerRef.current = window.setTimeout(() => setToastMessage(null), TOAST_DURATION);
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { toastMessage, showToast };
}
