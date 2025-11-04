import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2025-12-31T00:00:00').getTime()
      const now = new Date().getTime()
      const difference = eventDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ]

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 md:gap-3 my-4 md:my-6 relative z-10">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 120
              }}
              className="relative"
            >
              {/* Clean professional card */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Subtle glow on hover */}
                <div className="absolute -inset-0.5 bg-primary-yellow/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Main card - clean edges */}
                <div className="relative bg-black/80 backdrop-blur-sm border border-primary-yellow/40 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[100px] overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary-yellow/5 to-transparent pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Number with flip animation */}
                    <div className="relative h-9 md:h-14 mb-2 flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={unit.value}
                          initial={{ y: 15, opacity: 0, rotateX: -90 }}
                          animate={{ y: 0, opacity: 1, rotateX: 0 }}
                          exit={{ y: -15, opacity: 0, rotateX: 90 }}
                          transition={{ 
                            duration: 0.4,
                            type: "spring",
                            stiffness: 250,
                            damping: 20
                          }}
                          className="text-2xl md:text-4xl font-bold text-primary-yellow font-gta"
                          style={{
                            textShadow: '0 0 15px rgba(251, 189, 49, 0.5), 0 0 30px rgba(251, 189, 49, 0.2)',
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {String(unit.value).padStart(2, '0')}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Label */}
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <div className="text-[10px] md:text-xs text-primary-white/60 uppercase tracking-[0.2em] font-medium">
                        {unit.label}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Clean separator between units */}
            {index < timeUnits.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.15 }}
                className="mx-1.5 md:mx-2.5"
              >
                <motion.div
                  className="text-xl md:text-2xl text-primary-yellow/50 font-bold"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  :
                </motion.div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Countdown
