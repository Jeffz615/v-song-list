import { useMemo } from 'react';
import { isLetterTag } from '../lib/songs';

interface TagFilterProps {
  tags: string[];
  isTagActive: (tag: string) => boolean;
  onToggleTag: (tag: string) => void;
}

interface ChipProps {
  tag: string;
  active: boolean;
  onToggle: (tag: string) => void;
}

function Chip({ tag, active, onToggle }: ChipProps) {
  return (
    <button
      type="button"
      className={active ? 'chip active' : 'chip'}
      data-tag={tag}
      aria-pressed={active}
      onClick={() => onToggle(tag)}
    >
      {tag.toUpperCase()}
    </button>
  );
}

/** 标签筛选区：多字标签是分类（多选），单字标签是首字索引（单选） */
export function TagFilter({ tags, isTagActive, onToggleTag }: TagFilterProps) {
  const styleTags = useMemo(() => tags.filter((tag) => !isLetterTag(tag)), [tags]);
  const letterTags = useMemo(() => tags.filter(isLetterTag), [tags]);

  return (
    <div className="tag-groups">
      <div className="tag-group">
        <span className="tag-group-label">分类</span>
        <div className="chip-row">
          {styleTags.map((tag) => (
            <Chip key={tag} tag={tag} active={isTagActive(tag)} onToggle={onToggleTag} />
          ))}
        </div>
      </div>
      <div className="tag-group">
        <span className="tag-group-label">首字</span>
        <div className="chip-row">
          {letterTags.map((tag) => (
            <Chip key={tag} tag={tag} active={isTagActive(tag)} onToggle={onToggleTag} />
          ))}
        </div>
      </div>
    </div>
  );
}
