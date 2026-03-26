import { useEffect, useState } from 'react';
import './Toast.css';

/**
 * Auto-dismissing toast notification.
 * Slides in from bottom-right and fades out after the specified duration.
 *
 * @param {{ message: string, type: 'success'|'error', duration?: number, onClose: () => void }} props
 */
export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast--${type} ${visible ? 'toast--visible' : 'toast--hidden'}`}>
      <span className="toast__icon">{type === 'success' ? '\u2713' : '\u2717'}</span>
      <span className="toast__message">{message}</span>
    </div>
  );
}
