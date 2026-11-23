import { useCallback } from 'react';
import { copyText } from '../lib/clipboard';
import { copyFeedback, orderText, type Song } from '../lib/songs';

/** 复制「点歌 XXX」指令并以 toast 反馈，随机点歌与列表复制共用 */
export function useCopySong(showToast: (message: string) => void) {
  return useCallback(
    async (song: Song) => {
      const copied = await copyText(orderText(song));
      showToast(copied ? copyFeedback(song) : '浏览器阻止了剪贴板访问，请手动复制歌名~');
    },
    [showToast],
  );
}
