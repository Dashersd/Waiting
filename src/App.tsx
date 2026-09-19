import { useState } from 'react'
import './App.css'
import Preloader from './components/Preloader'
import ParticleHeart from './components/ParticleHeart'
import ConfessionLetter from './components/ConfessionLetter'
import BackgroundEffects from './components/BackgroundEffects'

function App() {
  const [showParticles, setShowParticles] = useState(false)
  const [isDispersing, setIsDispersing] = useState(false)
  const [showEnvelope, setShowEnvelope] = useState(false)

  const handleScreenClick = () => {
    if (showParticles && !isDispersing && !showEnvelope) {
      setIsDispersing(true);
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
      <ConfessionLetter visible={showEnvelope} />
    </div>
  )
}

export default App
