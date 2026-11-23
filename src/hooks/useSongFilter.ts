import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterSongs, isLetterTag, type Song, type SongFilters } from '../lib/songs';

/** 筛选条件条上的一条可移除条件 */
export type FilterToken =
  | { type: 'style'; label: string; value: string }
  | { type: 'letter'; label: string; value: string }
  | { type: 'price'; label: string; value: number };

const DEBOUNCE_MS = 200;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * 歌单筛选：关键字（防抖）+ 分类标签多选 + 首字单选 + 金额多选
 * 关键字只做歌名 / 歌手 / 拼音备注的模糊匹配，筛选状态不再写进输入框
 */
export function useSongFilter(library: Song[]) {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword, DEBOUNCE_MS);
  const [styleTags, setStyleTags] = useState<ReadonlySet<string>>(() => new Set());
  const [letter, setLetter] = useState<string | null>(null);
  const [prices, setPrices] = useState<ReadonlySet<number>>(() => new Set());

  const toggleTag = useCallback((tag: string) => {
    if (isLetterTag(tag)) {
      // 首字单选：再点一次同一个即取消
      setLetter((current) => (current === tag ? null : tag));
      return;
    }
    setStyleTags((current) => {
      const next = new Set(current);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }, []);

  const togglePrice = useCallback((money: number) => {
    setPrices((current) => {
      const next = new Set(current);
      if (next.has(money)) {
        next.delete(money);
      } else {
        next.add(money);
      }
      return next;
    });
  }, []);

  const removeFilter = useCallback((token: FilterToken) => {
    if (token.type === 'letter') {
      setLetter(null);
      return;
    }
    if (token.type === 'style') {
      setStyleTags((current) => {
        const next = new Set(current);
        next.delete(token.value);
        return next;
      });
      return;
    }
    setPrices((current) => {
      const next = new Set(current);
      next.delete(token.value);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setStyleTags(new Set());
    setLetter(null);
    setPrices(new Set());
  }, []);

  const filters: SongFilters = useMemo(
    () => ({ keyword: debouncedKeyword, styleTags, letter, prices }),
    [debouncedKeyword, styleTags, letter, prices],
  );

  const songs = useMemo(() => filterSongs(library, filters), [library, filters]);

  const isTagActive = useCallback(
    (tag: string) => (isLetterTag(tag) ? letter === tag : styleTags.has(tag)),
    [letter, styleTags],
  );

  const isPriceActive = useCallback((money: number) => prices.has(money), [prices]);

  const tokens = useMemo<FilterToken[]>(() => {
    const list: FilterToken[] = [...styleTags].map((tag) => ({
      type: 'style',
      label: tag,
      value: tag,
    }));
    if (letter) list.push({ type: 'letter', label: letter, value: letter });
    for (const price of prices) list.push({ type: 'price', label: `¥${price}`, value: price });
    return list;
  }, [styleTags, letter, prices]);

  return {
    keyword,
    setKeyword,
    songs,
    isTagActive,
    isPriceActive,
    toggleTag,
    togglePrice,
    tokens,
    removeFilter,
    clearFilters,
    hasFilter: tokens.length > 0,
  };
}
