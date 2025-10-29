import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Countdown from './Countdown'

const Hero = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-black to-primary-black/95">
      {/* Animated Background Particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => {
            const randomX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)
            const randomY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)
            const randomDelay = Math.random() * 2
            const randomDuration = Math.random() * 3 + 2
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-yellow rounded-full"
                initial={{
                  x: randomX,
                  y: randomY,
                  opacity: Math.random() * 0.5,
                }}
                animate={{
                  y: [randomY, randomY + (Math.random() * 200 - 100)],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: randomDelay,
                }}
              />
            )
          })}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
            <span className="text-primary-white">Founders Fest</span>
            <br />
            <span className="text-primary-yellow text-shadow-glow">2025-26</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary-yellow mb-2 md:mb-4"
          >
            Ignite. Build. Celebrate.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-primary-white/80 mb-8 md:mb-12 max-w-2xl mx-auto"
          >
            Two days of innovation, networking, and celebration.
          </motion.p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Countdown />
        </motion.div>

        {/* Register Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 md:mt-12"
        >
          <motion.a
            href="#register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-primary-yellow text-primary-black px-8 md:px-12 py-4 md:py-5 rounded-lg font-bold text-lg md:text-xl uppercase tracking-wider shadow-lg hover:shadow-primary-yellow/50 transition-all duration-300"
          >
            Register Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
