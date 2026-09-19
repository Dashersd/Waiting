import { useState, useEffect, useRef } from 'react';
import './ConfessionLetter.css';

const fullText = `I just want to say thank you.

Thank you for being there, for the little conversations, the time you give, and even for the simple moments that might not mean much to you but actually mean a lot to me.

I’m really grateful that I met you. I don’t know exactly where this will lead us, and I don’t want to force anything. I just want to let things happen naturally, at the right time and in the right way.

I like you, and I think you already know that. And honestly, I’m willing to wait for you.

Not because I expect you to promise me anything, and not because I want you to feel pressured. I’m waiting because I genuinely care about you, and because I believe some things are worth being patient for.

I know there might be days when the chances feel small, and there may be times when I wonder if waiting is still worth it. But I made a promise to myself that as long as I still feel the same, I’ll keep that promise.

I’ll keep doing my own thing, growing, learning, and living my life. I won’t stop you from living yours either. I just hope that someday, when the timing is finally right, our paths will cross in the way we both hoped for.

Until then, thank you for simply being you. Thank you for being there, even in the smallest ways. You probably don't realize how much those moments mean to me.

I don't know what the future holds for us.

But for now, I’m happy knowing that I met you.

And if waiting is what it takes, then I’ll wait.

Until our paths finally cross.`;

const ConfessionLetter = ({ visible, onClosed }: { visible: boolean; onClosed?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const textIndex = useRef(0);
  const [isTyping, setIsTyping] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
  const [showClose, setShowClose] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [burstParticles, setBurstParticles] = useState<number[]>([]);

  const handleClose = () => {
    setIsClosing(true);
    setBurstParticles(Array.from({ length: 60 }));
    if (onClosed) {
      setTimeout(onClosed, 1500); // Wait for dissolve animation
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
         setIsTyping(true);
      }, 800); // Start typing after envelope opens
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isTyping && textIndex.current < fullText.length) {
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + fullText.charAt(textIndex.current));
        textIndex.current++;
        
        // Auto-scroll to bottom as it types
        if (letterRef.current) {
          letterRef.current.scrollTop = letterRef.current.scrollHeight;
        }

        if (textIndex.current >= fullText.length) {
          clearInterval(interval);
          setIsTyping(false);
          setTimeout(() => setShowClose(true), 2000);
        }
      }, 50); // Slower typing speed
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  return (
    <div className={`confession-container ${visible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}>
      <div 
        className={`envelope-wrapper ${isOpen ? 'open' : ''}`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <div className="envelope">
          <div className="envelope-front"></div>
          <div className="envelope-flap"></div>
          <div className="envelope-pocket"></div>
          <div className="envelope-back"></div>
          <div className="letter" ref={letterRef}>
            <div className="letter-content">
              <h2 className="letter-title">Hello ET,</h2>
              <div className="typewriter-text">{displayedText}</div>
              {showClose && !isClosing && (
                <button className="close-btn" onClick={(e) => { e.stopPropagation(); handleClose(); }}>
                  Tap to close
                </button>
              )}
            </div>
          </div>
        </div>
        
        {burstParticles.map((_, i) => (
          <div key={i} className="burst-particle" style={{
            '--tx': `${(Math.random() - 0.5) * 600}px`,
            '--ty': `${(Math.random() - 0.5) * 600}px`,
            '--delay': `${Math.random() * 0.15}s`,
          } as React.CSSProperties} />
        ))}
      </div>
      
      {!isOpen && (
        <p className="open-hint">Tap the envelope to open</p>
      )}
    </div>
  );
};

export default ConfessionLetter;
