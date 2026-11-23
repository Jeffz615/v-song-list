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

/** 当前筛选条件：关键字 + 分类标签（多选）+ 首字（单选）+ 点歌金额（多选） */
export interface SongFilters {
  keyword: string;
  styleTags: ReadonlySet<string>;
  letter: string | null;
  prices: ReadonlySet<number>;
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
  { price: 70, bgColor: 'rgba(255,202,40,1)', fColor: 'rgba(0,0,0,0.87)' },
  { price: 140, bgColor: 'rgba(245,124,0,1)', fColor: 'rgba(255,255,255,0.87)' },
  { price: 350, bgColor: 'rgba(233,30,99,1)', fColor: 'rgba(255,255,255,1)' },
  { price: 700, bgColor: 'rgba(230,33,23,1)', fColor: 'rgba(255,255,255,1)' },
];

/** 根据点歌金额取价格标签配色，金额越高颜色越醒目 */
export function resolvePriceColor(money: number): { bgColor: string; fColor: string } {
  let color = { bgColor: 'rgba(201,184,232,0.25)', fColor: 'rgba(245,243,255,1)' };
  for (const tier of PRICE_TIERS) {
    if (money >= tier.price) {
      color = { bgColor: tier.bgColor, fColor: tier.fColor };
    }
  }
  return color;
}

/** 单字标签（A-Z / 假名）视为首字索引，多字标签视为分类 */
export function isLetterTag(tag: string): boolean {
  return [...tag].length === 1;
}

const noFilter = (filters: SongFilters) =>
  !filters.keyword.trim() && filters.styleTags.size === 0 && !filters.letter && filters.prices.size === 0;

export function filterSongs(songs: Song[], filters: SongFilters): Song[] {
  if (noFilter(filters)) return songs;

  const keyword = filters.keyword.trim().toUpperCase();
  return songs.filter((song) => {
    for (const tag of filters.styleTags) {
      if (!song.tags.includes(tag)) return false;
    }
    if (filters.letter && !song.tags.includes(filters.letter)) return false;
    if (filters.prices.size && !filters.prices.has(song.money)) return false;
    if (keyword) {
      const hit = [song.song, song.singer, song.remark].some((field) =>
        field.toUpperCase().includes(keyword),
      );
      if (!hit) return false;
    }
    return true;
  });
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
