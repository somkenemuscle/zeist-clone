import { MotionConfig } from 'motion/react'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { useSpotlight } from './hooks/useSpotlight'
import { reducedMotionMode } from './lib/motion'
import { Cta } from './sections/Cta'
import { Environments } from './sections/Environments'
import { Faq } from './sections/Faq'
import { Hero } from './sections/Hero'
import { Runtime } from './sections/Runtime'
import { Storage } from './sections/Storage'
import { Templates } from './sections/Templates'
import { Workloads } from './sections/Workloads'

function App() {
  useSpotlight()

  return (
    <MotionConfig reducedMotion={reducedMotionMode}>
      <Navbar />
      <main id="main">
        <Hero />
        <Runtime />
        <Environments />
        <Storage />
        <Workloads />
        <Templates />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default App
