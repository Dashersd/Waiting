import './BackgroundEffects.css';

const BackgroundEffects = ({ visible }: { visible: boolean }) => {
  // Generate 40 bokeh particles
  const particles = Array.from({ length: 40 });

  return (
    <div className={`background-effects-container ${visible ? 'visible' : ''}`}>
      {particles.map((_, i) => {
        const size = Math.random() * 80 + 20; // 20px to 100px
        const left = Math.random() * 100; // 0% to 100%
        const delay = Math.random() * 10; // 0s to 10s delay
        const duration = Math.random() * 15 + 15; // 15s to 30s float duration
        const opacity = Math.random() * 0.4 + 0.1; // 0.1 to 0.5 opacity

        return (
          <div
            key={i}
            className="bokeh-particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}vw`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              opacity: opacity,
            }}
          />
        );
      })}
    </div>
  );
};

export default BackgroundEffects;
