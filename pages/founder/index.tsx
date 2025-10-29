import { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

const Founder: NextPage = () => {
  return (
    <>
      <Head>
        <title>Meet the Founder | Founders Fest 2025-26</title>
        <meta name="description" content="Meet the founder of Adventure Park Incubation Center." />
      </Head>
      <Navbar />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-primary-black to-primary-black/95">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-primary-yellow mb-6">
                Meet the Founder
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-primary-black border-2 border-primary-yellow rounded-lg p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Image Placeholder */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0"
                >
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-primary-yellow/20 border-4 border-primary-yellow rounded-full flex items-center justify-center">
                    <span className="text-6xl md:text-8xl">👤</span>
                  </div>
                </motion.div>

                {/* Founder Info */}
                <div className="flex-1 text-center md:text-left">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-primary-yellow mb-2"
                  >
                    To be updated
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-primary-white/70 mb-6"
                  >
                    Founder & CEO
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <p className="text-lg text-primary-white/80 leading-relaxed">
                      This is a placeholder bio paragraph that will be updated with the founder&apos;s 
                      actual background, experience, vision, and achievements. The text here describes 
                      their journey as an entrepreneur, their passion for supporting startups, and their 
                      vision for the future of innovation.
                    </p>
                    <p className="text-lg text-primary-white/80 leading-relaxed">
                      With years of experience in the startup ecosystem, the founder has been instrumental 
                      in nurturing numerous successful ventures and building a vibrant community of 
                      entrepreneurs, investors, and innovators.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Founder
