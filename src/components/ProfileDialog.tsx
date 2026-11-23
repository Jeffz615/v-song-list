import { useEffect, useRef, type MouseEvent } from 'react';
import avatarImage from '../assets/avatar.jpg';
import lblImage from '../assets/lbl.jpg';
import {
  PROFILE_INTRO_PREFIX,
  PROFILE_INTRO_SUFFIX,
  PROFILE_LINKS,
  PROFILE_PARAGRAPHS,
  PROFILE_TITLE,
} from '../lib/profile';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const resolveIcon = (icon: string) => (icon === 'lbl' ? lblImage : icon);

/** 主播资料：原生 <dialog>，支持 Esc、点遮罩关闭，移动端自动变成底部弹层风格 */
export function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="profile-dialog"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className="profile-head">
        <img className="profile-avatar" src={avatarImage} alt="" draggable={false} />
        <div>
          <h2>{PROFILE_TITLE}</h2>
          <button type="button" className="dialog-close" aria-label="关闭" onClick={onClose}>
            &times;
          </button>
        </div>
      </div>

      <div className="profile-text">
        <p>
          {PROFILE_INTRO_PREFIX}
          <span className="profile-name">幽灵车尔尼桑</span>
          {PROFILE_INTRO_SUFFIX}
        </p>
        {PROFILE_PARAGRAPHS.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>

      <div className="profile-links">
        {PROFILE_LINKS.map((link) => (
          <a key={link.key} href={link.href} target="_blank" rel="noreferrer">
            <img
              src={resolveIcon(link.icon)}
              alt=""
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden';
              }}
            />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </dialog>
  );
}
