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

const ConfessionLetter = ({ visible }: { visible: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const textIndex = useRef(0);
  const [isTyping, setIsTyping] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

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
        }
      }, 50); // Slower typing speed
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  return (
    <div className={`confession-container ${visible ? 'visible' : ''}`}>
      <div 
        className={`envelope-wrapper ${isOpen ? 'open' : ''}`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <div className="envelope">
          <div className="envelope-back"></div>
          <div className="letter" ref={letterRef}>
            <div className="letter-content">
              <h2 className="letter-title">Hello ET,</h2>
              <div className="typewriter-text">{displayedText}</div>
            </div>
          </div>
          <div className="envelope-pocket"></div>
          <div className="envelope-flap"></div>
        </div>
        {!isOpen && <div className="open-hint">Click to open</div>}
      </div>
    </div>
  );
};

export default ConfessionLetter;
