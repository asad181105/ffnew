"use client"

import { motion } from "framer-motion"
import Floating, {
  FloatingElement,
} from "@/components/ui/parallax-floating"

// Founders Fest themed images from Unsplash - entrepreneurial, networking, innovation
const foundersFestImages = [
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    alt: "Team collaboration",
  },
  {
    url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop",
    alt: "Business networking",
  },
  {
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop",
    alt: "Startup meeting",
  },
  {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    alt: "Innovation and technology",
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    alt: "Team working together",
  },
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    alt: "Business presentation",
  },
  {
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    alt: "Modern office space",
  },
  {
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    alt: "Business strategy",
  },
]

const ParallaxSection = () => {
  return (
    <section className="relative w-full h-full min-h-[600px] md:min-h-[700px] flex justify-center items-center bg-primary-black overflow-hidden">
      <div className="flex w-full h-full justify-center items-center">
        {/* Center content */}
        <motion.div
          className="z-50 text-center space-y-4 items-center flex flex-col"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.88, delay: 1.5 }}
        >
          <p className="text-4xl md:text-6xl lg:text-7xl z-50 text-primary-yellow font-bold italic">
            Founders Fest
          </p>
          <p className="text-sm md:text-base z-50 hover:scale-110 transition-transform bg-primary-yellow text-primary-black rounded-full py-2 px-6 cursor-pointer font-semibold">
            Register Now
          </p>
        </motion.div>

        {/* Floating Images */}
        <Floating sensitivity={-1} className="overflow-hidden">
          <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0 }}
              src={foundersFestImages[0].url}
              alt={foundersFestImages[0].alt}
              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer transition-transform border-2 border-primary-yellow/30 hover:border-primary-yellow"
            />
          </FloatingElement>
          
          <FloatingElement depth={1} className="top-[10%] left-[32%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              src={foundersFestImages[1].url}
              alt={foundersFestImages[1].alt}
              className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer transition-transform border-2 border-primary-yellow/30 hover:border-primary-yellow"
            />
          </FloatingElement>
          
          <FloatingElement depth={2} className="top-[2%] left-[53%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              src={foundersFestImages[2].url}
              alt={foundersFestImages[2].alt}
              className="w-28 h-40 md:w-40 md:h-52 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer transition-transform border-2 border-primary-yellow/30 hover:border-primary-yellow"
            />
          </FloatingElement>
          
          <FloatingElement depth={1} className="top-[0%] left-[83%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              src={foundersFestImages[3].url}
              alt={foundersFestImages[3].alt}
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer transition-transform border-2 border-primary-yellow/30 hover:border-primary-yellow"
            />
          </FloatingElement>

          <FloatingElement depth={1} className="top-[40%] left-[2%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              src={foundersFestImages[4].url}
              alt={foundersFestImages[4].alt}
              className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer transition-transform border-2 border-primary-yellow/30 hover:border-primary-yellow"
            />
          </FloatingElement>
          
          <FloatingElement depth={2} className="top-[70%] left-[77%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              src={foundersFestImages[5].url}
              alt={foundersFestImages[5].alt}
              className="w-28 h-28 md:w-36 md:h-48 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer transition-transform border-2 border-primary-yellow/30 hover:border-primary-yellow"
            />
          </FloatingElement>

          <FloatingElement depth={4} className="top-[73%] left-[15%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              src={foundersFestImages[6].url}
              alt={foundersFestImages[6].alt}
              className="w-40 md:w-52 h-full object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer transition-transform border-2 border-primary-yellow/30 hover:border-primary-yellow"
            />
          </FloatingElement>
          
          <FloatingElement depth={1} className="top-[80%] left-[50%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.05 }}
              src={foundersFestImages[7].url}
              alt={foundersFestImages[7].alt}
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg hover:scale-105 duration-200 cursor-pointer transition-transform border-2 border-primary-yellow/30 hover:border-primary-yellow"
            />
          </FloatingElement>
        </Floating>
      </div>
    </section>
  )
}

export default ParallaxSection
