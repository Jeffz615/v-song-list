import avatarImage from '../assets/avatar.jpg';

interface HeroSectionProps {
  shownCount: number;
  totalCount: number;
  onOpenProfile: () => void;
}

/** 头部：头像（点开主播资料）、标题、当前筛选结果数量、操作提示 */
export function HeroSection({ shownCount, totalCount, onOpenProfile }: HeroSectionProps) {
  const filtered = shownCount !== totalCount;

  return (
    <header className="hero">
      <button
        type="button"
        className="avatar-button"
        onClick={onOpenProfile}
        aria-label="查看主播信息"
      >
        <img className="hero-avatar" src={avatarImage} alt="幽灵车尔尼桑" draggable={false} />
      </button>
      <h1 className="hero-title">幽灵车尔尼桑</h1>
      <p className="hero-sub">
        {filtered ? (
          <>
            为你找到 <b>{shownCount}</b> / {totalCount} 首~
          </>
        ) : (
          <>
            带来了她的 <b>{shownCount}</b> 首歌~
          </>
        )}
      </p>
      <p className="hero-tips">~点击头像查看主播信息 · 双击歌曲复制点歌指令~</p>
    </header>
  );
}
