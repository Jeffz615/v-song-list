import { App as AntdApp } from 'antd';
import { useCallback } from 'react';
import { copyText } from '../lib/clipboard';
import { copyFeedback, orderText, type Song } from '../lib/songs';

/** 复制“点歌 XXX”指令并给出反馈，随机点歌与双击列表共用 */
export function useCopySong() {
  const { message } = AntdApp.useApp();

  return useCallback(
    async (song: Song) => {
      const copied = await copyText(orderText(song));
      if (copied) {
        message.success(copyFeedback(song));
      } else {
        message.warning('浏览器阻止了剪贴板访问，请手动复制歌名~');
      }
    },
    [message],
  );
}
