interface ToastProps {
  message: string | null;
}

/** 复制结果提示，靠 CSS 过渡淡入淡出 */
export function Toast({ message }: ToastProps) {
  return (
    <div className={message ? 'toast show' : 'toast'} role="status" aria-live="polite">
      {message}
    </div>
  );
}
