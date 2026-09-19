import { useEffect, useState } from 'react';
import './Preloader.css';

interface PreloaderProps {
  onLoaded?: () => void;
  duration?: number;
}

const Preloader = ({ onLoaded, duration = 3000 }: PreloaderProps) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
        if (onLoaded) {
          onLoaded();
        }
      }, 500); // 500ms fade out duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onLoaded]);

  if (!loading) return null;

  return (
    <div className={`preloader-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="heart-wrapper">
        <div className="heart"></div>
        <div className="glow"></div>
      </div>
      <p className="loading-text">Loading Love...</p>
    </div>
  );
};

export default Preloader;
