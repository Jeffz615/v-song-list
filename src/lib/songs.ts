export interface Song {
  key: number;
  money: number;
  song: string;
  link: string;
  singer: string;
  tags: string[];
  remark: string;
}

export interface SongLibrary {
  data: Song[];
  tags: string[];
}

interface PriceTier {
  price: number;
  bgColor: string;
  fColor: string;
}

const PRICE_TIERS: PriceTier[] = [
  { price: 7, bgColor: 'rgba(30,136,229,1)', fColor: 'rgba(255,255,255,1)' },
  { price: 14, bgColor: 'rgba(0,229,255,1)', fColor: 'rgba(0,0,0,1)' },
  { price: 35, bgColor: 'rgba(29,233,182,1)', fColor: 'rgba(0,0,0,1)' },
  { price: 70, bgColor: 'rgba(255,202,40,1)', fColor: 'rgba(0,0,0,0.87451)' },
  { price: 140, bgColor: 'rgba(245,124,0,1)', fColor: 'rgba(255,255,255,0.87451)' },
  { price: 350, bgColor: 'rgba(233,30,99,1)', fColor: 'rgba(255,255,255,1)' },
  { price: 700, bgColor: 'rgba(230,33,23,1)', fColor: 'rgba(255,255,255,1)' },
];

/** 根据点歌金额取价格标签配色，金额越高颜色越醒目 */
export function resolvePriceColor(money: number): { bgColor: string; fColor: string } {
  let color = { bgColor: 'rgba(255,255,255,1)', fColor: 'rgba(0,0,0,1)' };
  for (const tier of PRICE_TIERS) {
    if (money >= tier.price) {
      color = { bgColor: tier.bgColor, fColor: tier.fColor };
    }
  }
  return color;
}

const QUERY_SEPARATOR = /[\s,，]+/;

/** 搜索词按空格 / 中英文逗号切分 */
function splitQuery(query: string): string[] {
  return query
    .split(QUERY_SEPARATOR)
    .map((word) => word.trim())
    .filter(Boolean);
}

/**
 * 单曲是否命中搜索词
 * 支持 `!T:标签` 精确匹配标签、`!M:金额` 精确匹配点歌金额，其余按歌名 / 歌手 / 拼音备注模糊匹配
 */
export function matchSong(song: Song, query: string): boolean {
  for (const raw of splitQuery(query)) {
    const word = raw.toUpperCase();
    if (word.startsWith('!T:')) {
      if (!song.tags.includes(word.slice(3))) return false;
      continue;
    }
    if (word.startsWith('!M:')) {
      if (song.money !== Number(word.slice(3))) return false;
      continue;
    }
    const hit = [song.song, song.singer, song.remark].some((field) =>
      field.toUpperCase().includes(word),
    );
    if (!hit) return false;
  }
  return true;
}

export function filterSongs(songs: Song[], query: string): Song[] {
  if (!query.trim()) return songs;
  return songs.filter((song) => matchSong(song, query));
}

export function pickRandomSong(songs: Song[]): Song | undefined {
  if (songs.length === 0) return undefined;
  return songs[Math.floor(Math.random() * songs.length)];
}

export function orderText(song: Song): string {
  return `点歌 ${song.song}`;
}

export function copyFeedback(song: Song): string {
  return song.money > 0
    ? `"${orderText(song)}"已复制，快去直播间打 ${song.money} 米点歌吧~`
    : `"${orderText(song)}"已复制，快去直播间点歌吧~`;
}
