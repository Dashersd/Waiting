import { useState, useRef } from 'react'
import './App.css'
import Preloader from './components/Preloader'
import ParticleHeart from './components/ParticleHeart'
import ConfessionLetter from './components/ConfessionLetter'
import BackgroundEffects from './components/BackgroundEffects'
import NextAnimation from './components/NextAnimation'

function App() {
  const [showParticles, setShowParticles] = useState(false)
  const [isDispersing, setIsDispersing] = useState(false)
  const [showEnvelope, setShowEnvelope] = useState(false)
  const [letterClosed, setLetterClosed] = useState(false)
  const [showNextAnimation, setShowNextAnimation] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleScreenClick = () => {
    if (showParticles && !isDispersing && !showEnvelope) {
      setIsDispersing(true);
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
    }
  };

  const handleParticlesDispersed = () => {
    setShowEnvelope(true);
  };

  return (
    <div 
      style={{ backgroundColor: '#050505', width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', cursor: showParticles && !isDispersing ? 'pointer' : 'default' }}
      onClick={handleScreenClick}
    >
      <Preloader onLoaded={() => setShowParticles(true)} />
      <BackgroundEffects visible={isDispersing} />
      <ParticleHeart 
        visible={showParticles} 
        isDispersing={isDispersing}
        onDispersed={handleParticlesDispersed}
      />
      {!letterClosed && (
        <ConfessionLetter 
          visible={showEnvelope} 
          onClosed={() => setLetterClosed(true)} 
        />
      )}

      {letterClosed && !showNextAnimation && (
        <div 
          className="next-label"
          onClick={() => setShowNextAnimation(true)}
        >
          One more thing...
        </div>
      )}

      <NextAnimation visible={showNextAnimation} />
      <audio ref={audioRef} src="/music/Ace Banzuelo - Muli (Secret Verse).mp3" loop />
    </div>
  )
}

export default App
