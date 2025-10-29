import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock } from 'lucide-react'

interface EventCardProps {
  title: string
  date: string
  time: string
  location: string
  description: string
  imageUrl?: string
}

const EventCard = ({ title, date, time, location, description, imageUrl }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg overflow-hidden hover:border-primary-yellow transition-all duration-300 group"
    >
      {imageUrl && (
        <div className="h-48 bg-primary-yellow/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-yellow/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary-yellow/30 text-4xl">📅</span>
          </div>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary-yellow mb-3 group-hover:text-primary-yellow transition-colors">
          {title}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-primary-white/70 text-sm">
            <Calendar className="mr-2 text-primary-yellow" size={16} />
            {date}
          </div>
         超出 <div className="flex items-center text-primary-white/70 text-sm">
            <Clock className="mr-2 text-primary-yellow" size={16} />
            {time}
          </div>
          <div className="flex items-center text-primary-white/70 text-sm">
            <MapPin className="mr-2 text-primary-yellow" size={16} />
            {location}
          </div>
        </div>
        <p className="text-primary-white/80 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export default EventCard
