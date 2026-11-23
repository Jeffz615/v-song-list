interface SearchToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onRandom: () => void;
}

/** 吸顶工具栏：关键字搜索 + 随机点歌 */
export function SearchToolbar({ keyword, onKeywordChange, onRandom }: SearchToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
        </svg>
        <input
          type="search"
          id="searchInput"
          placeholder="搜索歌名、歌手或拼音…"
          autoComplete="off"
          enterKeyHint="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
        />
        {keyword ? (
          <button
            type="button"
            className="clear-btn"
            aria-label="清空搜索"
            onClick={() => onKeywordChange('')}
          >
            &times;
          </button>
        ) : null}
      </div>
      <button type="button" className="btn btn-primary" onClick={onRandom} title="随机复制一首点歌指令">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4V1L8 5l4 4V6a6 6 0 0 1 5.66 8 5 5 0 0 1 1.2 1.55A8 8 0 0 0 12 4Zm-5.66 6A5 5 0 0 1 5.14 8.45 8 8 0 0 0 12 20v3l4-4-4-4v3a6 6 0 0 1-5.66-8Z" />
        </svg>
        随机一个
      </button>
    </div>
  );
}
