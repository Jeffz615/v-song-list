import { useEffect, useState } from 'react';
import pixelImage from '../assets/pixel.png';

const VISIBILITY_HEIGHT = 400;

/** 回到顶部：滚动超过一屏后出现的像素小人 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > VISIBILITY_HEIGHT);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="backtop"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="回到顶部"
    >
      <img src={pixelImage} alt="" draggable={false} />
    </button>
  );
}
