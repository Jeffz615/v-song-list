import { App as AntdApp, Col, ConfigProvider, Layout, Row } from 'antd';
import type { ThemeConfig } from 'antd';
import { useState } from 'react';
import './App.css';
import libraryJson from './assets/data.json';
import { BackToTopButton } from './components/BackToTopButton';
import { HeroSection } from './components/HeroSection';
import { ProfileDrawer } from './components/ProfileDrawer';
import { SongTable } from './components/SongTable';
import { useCopySong } from './hooks/useCopySong';
import { useSongQuery } from './hooks/useSongQuery';
import { pickRandomSong, type SongLibrary } from './lib/songs';

const library = libraryJson as SongLibrary;

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#d58a98',
    colorLink: '#d58a98',
    borderRadius: 8,
    fontSize: 15,
  },
};

function SongListPage() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { query, setQuery, appendToken, songs } = useSongQuery(library.data);
  const copySong = useCopySong();

  const handleRandom = () => {
    const song = pickRandomSong(songs);
    if (song) void copySong(song);
  };

  const handleTagClick = (tag: string) => appendToken(`!T:${tag}`);

  return (
    <>
      <Layout className="app-layout">
        <Row justify="center">
          <Col xxl={12} xl={16} lg={18} md={20} sm={22} xs={24} className="panel">
            <HeroSection
              count={songs.length}
              tags={library.tags}
              query={query}
              onQueryChange={setQuery}
              onTagClick={handleTagClick}
              onRandom={handleRandom}
              onOpenProfile={() => setProfileOpen(true)}
            />
            <SongTable
              songs={songs}
              onTagClick={handleTagClick}
              onMoneyClick={(money) => appendToken(`!M:${money}`)}
              onCopy={(song) => void copySong(song)}
            />
          </Col>
        </Row>
      </Layout>
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
      <BackToTopButton />
    </>
  );
}

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <SongListPage />
      </AntdApp>
    </ConfigProvider>
  );
}
