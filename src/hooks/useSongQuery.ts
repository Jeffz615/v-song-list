import { useEffect, useMemo, useState } from 'react';
import { filterSongs, type Song } from '../lib/songs';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/** 歌单搜索：维护输入值、防抖后的过滤结果，以及标签 / 价格快捷筛选 */
export function useSongQuery(library: Song[]) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 200);

  const songs = useMemo(
    () => filterSongs(library, debouncedQuery),
    [library, debouncedQuery],
  );

  const appendToken = (token: string) => {
    setQuery((current) => (current.trim() ? `${current.trimEnd()} ${token}` : token));
  };

  return { query, setQuery, appendToken, songs };
}
