import { useEffect, useState } from 'react';
import './NextAnimation.css';

const NextAnimation = ({ visible }: { visible: boolean }) => {
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    if (visible) {
      // The constellation draws over 4 seconds, then show quote
      const timer = setTimeout(() => {
        setShowQuote(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="next-animation-container">
      <svg className="constellation-svg" viewBox="0 0 400 400">
        <path 
          className="constellation-line" 
          d="M 200 80 L 120 40 L 40 100 L 80 200 L 200 320 L 320 200 L 360 100 L 280 40 Z" 
        />
        <circle cx="200" cy="80" r="4" className="star" />
        <circle cx="120" cy="40" r="4" className="star" style={{animationDelay: '0.5s'}} />
        <circle cx="40" cy="100" r="4" className="star" style={{animationDelay: '1s'}} />
        <circle cx="80" cy="200" r="4" className="star" style={{animationDelay: '1.5s'}} />
        <circle cx="200" cy="320" r="4" className="star" style={{animationDelay: '2s'}} />
        <circle cx="320" cy="200" r="4" className="star" style={{animationDelay: '2.5s'}} />
        <circle cx="360" cy="100" r="4" className="star" style={{animationDelay: '3s'}} />
        <circle cx="280" cy="40" r="4" className="star" style={{animationDelay: '3.5s'}} />
      </svg>
      
      <div className={`final-quote ${showQuote ? 'visible' : ''}`}>
        "I'll be right here, waiting."
      </div>
    </div>
  );
};

export default NextAnimation;
