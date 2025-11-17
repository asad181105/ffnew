import { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { motion } from 'framer-motion'

const Home: NextPage = () => {
  return (
    <div style={{ margin: 0, padding: 0, background: 'transparent' }}>
      <Head>
        <title>Founders Fest 2025-26 | Ignite. Build. Celebrate.</title>
        <meta name="description" content="Founders Fest 2025-26 - Two days of innovation, networking, and celebration on December 31, 2025 and January 1, 2026." />
      </Head>
      <main style={{ background: 'transparent', margin: 0, padding: 0, position: 'relative' }} className="pt-16 md:pt-0">
        <Navbar variant="floating" />
        <Hero />
        {/* Register Section */}
        {/* <section id="register" className="py-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-primary-yellow mb-6">
                Join Us for an Unforgettable Experience
              </h2>
              <p className="text-lg md:text-xl text-primary-white/80 mb-8 max-w-2xl mx-auto">
                Connect with fellow entrepreneurs, investors, and innovators. Register now to secure your spot!
              </p>
              <motion.a
                href="#register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-primary-yellow text-primary-black px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl uppercase tracking-wider shadow-lg hover:shadow-primary-yellow/50 transition-all duration-300"
              >
                Register Now
              </motion.a>
            </motion.div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  )
}

export default Home
