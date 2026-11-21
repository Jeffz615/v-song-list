import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Tag } from 'antd';
import avatarImage from '../assets/avatar.jpg';

interface HeroSectionProps {
  count: number;
  tags: string[];
  query: string;
  onQueryChange: (value: string) => void;
  onTagClick: (tag: string) => void;
  onRandom: () => void;
  onOpenProfile: () => void;
}

export function HeroSection({
  count,
  tags,
  query,
  onQueryChange,
  onTagClick,
  onRandom,
  onOpenProfile,
}: HeroSectionProps) {
  return (
    <header className="hero">
      <div className="hero-avatar-row">
        <button type="button" className="avatar-button" onClick={onOpenProfile} aria-label="查看主播信息">
          <Avatar
            className="hero-avatar"
            src={avatarImage}
            alt="幽灵车尔尼桑"
            size={{ xs: 100, sm: 150, md: 180, lg: 200, xl: 220, xxl: 250 }}
          />
        </button>
      </div>

      <h1 className="hero-title">幽灵车尔尼桑</h1>
      <p className="hero-title">带来了她的{count}首歌~</p>
      <p className="hero-tip">~点击头像查看主播信息~</p>
      <p className="hero-tip">~双击列表即可复制点歌指令~</p>

      <div className="tag-row">
        {tags.map((tag) => (
          <Tag key={tag} color="cyan" className="clickable-tag" onClick={() => onTagClick(tag)}>
            {tag.toUpperCase()}
          </Tag>
        ))}
      </div>

      <div className="hero-search">
        <Input
          className="search-input"
          placeholder="输入关键字看看有没有你想听的？"
          allowClear
          prefix={<SearchOutlined />}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <Button type="primary" shape="round" className="random-button" icon={<SyncOutlined />} onClick={onRandom}>
          随机一个
        </Button>
      </div>
    </header>
  );
}
