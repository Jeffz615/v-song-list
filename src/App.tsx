import { useRef, useState } from 'react';
import './App.css';
import libraryJson from './assets/data.json';
import { BackToTopButton } from './components/BackToTopButton';
import { FilterBar } from './components/FilterBar';
import { HeroSection } from './components/HeroSection';
import { ProfileDialog } from './components/ProfileDialog';
import { SearchToolbar } from './components/SearchToolbar';
import { SongList } from './components/SongList';
import { TagFilter } from './components/TagFilter';
import { Toast } from './components/Toast';
import { useCopySong } from './hooks/useCopySong';
import { useSongFilter } from './hooks/useSongFilter';
import { useToast } from './hooks/useToast';
import { pickRandomSong, type SongLibrary } from './lib/songs';

const library = libraryJson as SongLibrary;

export default function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const filter = useSongFilter(library.data);
  const { toastMessage, showToast } = useToast();
  const copySong = useCopySong(showToast);
  const listRef = useRef<HTMLDivElement>(null);

  const handleRandom = () => {
    const song = pickRandomSong(filter.songs);
    if (!song) {
      showToast('当前筛选条件下没有歌可以随机啦~');
      return;
    }
    void copySong(song);
    // 顺手滚到这首歌并高亮，让「随机」更有惊喜感
    const row = listRef.current?.querySelector<HTMLElement>(`[data-key="${song.key}"]`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.remove('flash');
      void row.offsetWidth; // 重置动画
      row.classList.add('flash');
    }
  };

  return (
    <>
      {/* iPhone 灵动岛/状态栏安全区遮罩（无刘海设备高度为 0，不可见） */}
      <div className="top-veil" aria-hidden="true" />
      <main className="page">
        <section className="panel">
          <HeroSection
            shownCount={filter.songs.length}
            totalCount={library.data.length}
            onOpenProfile={() => setProfileOpen(true)}
          />

          <SearchToolbar
            keyword={filter.keyword}
            onKeywordChange={filter.setKeyword}
            onRandom={handleRandom}
          />

          <p className="syntax-hint">点击标签筛选，再次点击取消 · 分类可多选，首字单选</p>

          <TagFilter
            tags={library.tags}
            isTagActive={filter.isTagActive}
            onToggleTag={filter.toggleTag}
          />

          <FilterBar
            tokens={filter.tokens}
            onRemove={filter.removeFilter}
            onClear={filter.clearFilters}
          />

          <div ref={listRef}>
            <SongList
              songs={filter.songs}
              isTagActive={filter.isTagActive}
              isPriceActive={filter.isPriceActive}
              onToggleTag={filter.toggleTag}
              onTogglePrice={filter.togglePrice}
              onCopy={copySong}
            />
          </div>

          <footer className="footer">
            <p>
              Power by{' '}
              <a href="https://github.com/Jeffz615/v-song-list" target="_blank" rel="noreferrer">
                v-song-list
              </a>{' '}
              · 幽灵歌单 v2 ✦
            </p>
          </footer>
        </section>
      </main>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
      <BackToTopButton />
      <Toast message={toastMessage} />
    </>
  );
}
