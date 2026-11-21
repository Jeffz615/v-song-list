/**
 * 复制文本到剪贴板。
 * 优先使用异步 Clipboard API（需要 HTTPS / localhost），
 * 不可用时退化为 textarea + execCommand，兼容 http 内网调试。
 */
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 用户拒绝授权或浏览器策略限制，继续走兜底方案
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
