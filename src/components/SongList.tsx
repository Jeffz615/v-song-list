import { memo } from 'react';
import { resolvePriceColor, type Song } from '../lib/songs';

interface SongListProps {
  songs: Song[];
  isTagActive: (tag: string) => boolean;
  isPriceActive: (money: number) => boolean;
  onToggleTag: (tag: string) => void;
  onTogglePrice: (money: number) => void;
  onCopy: (song: Song) => void;
}

const CLIP_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77A26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);

const COPY_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
  </svg>
);

interface SongRowProps {
  song: Song;
  isTagActive: (tag: string) => boolean;
  isPriceActive: (money: number) => boolean;
  onToggleTag: (tag: string) => void;
  onTogglePrice: (money: number) => void;
  onCopy: (song: Song) => void;
}

const SongRow = memo(function SongRow({
  song,
  isTagActive,
  isPriceActive,
  onToggleTag,
  onTogglePrice,
  onCopy,
}: SongRowProps) {
  const price = song.money ? resolvePriceColor(song.money) : null;

  return (
    <div
      className="song-row"
      role="listitem"
      data-key={song.key}
      title="双击复制点歌指令"
      onDoubleClick={() => onCopy(song)}
    >
      {price ? (
        <button
          type="button"
          className={isPriceActive(song.money) ? 'price-badge active' : 'price-badge'}
          style={{ backgroundColor: price.bgColor, color: price.fColor }}
          title={`点击筛选 ¥${song.money} 点歌`}
          onClick={() => onTogglePrice(song.money)}
        >
          ¥{song.money}
        </button>
      ) : (
        <span className="price-badge empty" aria-hidden="true" />
      )}

      {song.link ? (
        <a
          className="clip-link"
          href={song.link}
          target="_blank"
          rel="noreferrer"
          aria-label="打开歌切视频"
          title="打开歌切视频"
          onDoubleClick={(event) => event.stopPropagation()}
        >
          {CLIP_ICON}
        </a>
      ) : (
        <span aria-hidden="true" />
      )}

      <div className="song-main">
        <span className="song-name">{song.song}</span>
        <span className="song-singer">{song.singer}</span>
      </div>

      {song.tags.length > 0 ? (
        <div className="song-tags">
          {song.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={isTagActive(tag) ? 'mini-chip active' : 'mini-chip'}
              aria-pressed={isTagActive(tag)}
              onClick={() => onToggleTag(tag)}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>
      ) : (
        <span aria-hidden="true" />
      )}

      <button
        type="button"
        className="copy-btn"
        aria-label="复制点歌指令"
        title="复制点歌指令"
        onClick={() => onCopy(song)}
      >
        {COPY_ICON}
      </button>
    </div>
  );
});

/** 歌单列表：桌面端网格行（金额 / 歌切 / 歌名歌手 / 标签 / 复制），窄屏由 CSS 切成卡片 */
export function SongList({
  songs,
  isTagActive,
  isPriceActive,
  onToggleTag,
  onTogglePrice,
  onCopy,
}: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="empty">
        <p className="empty-face">(´･ω･`)</p>
        <p>没有找到匹配的歌，换个关键词试试~</p>
      </div>
    );
  }

  return (
    <div className="song-list" role="list">
      {songs.map((song) => (
        <SongRow
          key={song.key}
          song={song}
          isTagActive={isTagActive}
          isPriceActive={isPriceActive}
          onToggleTag={onToggleTag}
          onTogglePrice={onTogglePrice}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}
