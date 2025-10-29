import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 my-8">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="bg-primary-black border-2 border-primary-yellow rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[120px]"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(255, 215, 0, 0.3)',
                '0 0 20px rgba(255, 215, 0, 0.5)',
                '0 0 10px rgba(255, 215, 0, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <motion.div
              key={unit.value}
              initial={{ scale: 0.2 }}
              animate={{ scale: 1 }}
              className="text-3xl md:text-5xl font-bold text-primary-yellow mb-2"
            >
              {String(unit.value).padStart(2, '0')}
            </motion.div>
            <div className="text-xs md:text-sm text-primary-white/70 uppercase tracking-wider">
              {unit.label}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

export default Countdown
