import type { FilterToken } from '../hooks/useSongFilter';

interface FilterBarProps {
  tokens: FilterToken[];
  onRemove: (token: FilterToken) => void;
  onClear: () => void;
}

/** 当前生效的筛选条件，单条可点掉，也可一键清除 */
export function FilterBar({ tokens, onRemove, onClear }: FilterBarProps) {
  if (tokens.length === 0) return null;

  return (
    <div className="filter-bar">
      <span className="filter-bar-label">筛选中</span>
      <div className="filter-bar-chips">
        {tokens.map((token) => (
          <button
            key={`${token.type}-${token.value}`}
            type="button"
            className="filter-token"
            title="点击移除该条件"
            onClick={() => onRemove(token)}
          >
            {token.label} <span className="times">&times;</span>
          </button>
        ))}
      </div>
      <button type="button" className="filter-clear" onClick={onClear}>
        清除筛选
      </button>
    </div>
  );
}
