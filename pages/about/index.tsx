import { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react'

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About | Founders Fest 2025-26</title>
        <meta name="description" content="Learn about Founders' Fest - a celebration of entrepreneurial spirit in Hyderabad." />
      </Head>
      <Navbar />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-primary-black to-primary-black/95">
          <div className="container mx-auto text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-primary-yellow mb-6">
                About Founders' Fest
              </h1>
              <p className="text-xl md:text-2xl text-primary-white/90 font-gta leading-relaxed">
                For the dreamers who dare and the doers who deliver - Founders' Fest is your place to shine
              </p>
            </motion.div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-0"
            >
              
            </motion.div>

            {/* The Essence of Founders' Fest */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">
                The Essence of Founders' Fest
              </h2>
              <div className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-6 md:p-8">
                <p className="text-lg text-primary-white/80 leading-relaxed mb-4">
                  More than just an event, Founders' Fest is a celebration of the entrepreneurial spirit—one that runs deep in our city. It's where stories of resilience, creativity, and impact come to life, creating a sense of belonging for every participant. From a vibrant Innovation Showcase to a thrilling Business Challenge, the Fest ensures that innovation and community remain at the forefront.
                </p>
                <p className="text-lg text-primary-white/80 leading-relaxed">
                  The highlight, undoubtedly, is The Great Hyderabad Business Challenge—a stage where startups pitch their solutions for a grand prize of ₹5,00,000, driving creativity and encouraging ideas. Beyond the competition, participants gain exclusive access to masterclasses led by industry leaders, expert mentors and a collaborative network that supports their journey long after the Fest ends.
                </p>
              </div>
            </motion.div>

            {/* A Look Back at Founders' Fest 2024 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">
                A Look Back at Founders' Fest 2024
              </h2>
              <div className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-6 md:p-8">
                <p className="text-lg text-primary-white/80 leading-relaxed mb-6">
                  The numbers alone tell a story of growth and impact.
                </p>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <span className="text-primary-yellow mr-3 text-xl">•</span>
                    <span className="text-lg text-primary-white/80"><strong className="text-primary-yellow">151 businesses</strong> participated, showcasing ideas and solutions.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-yellow mr-3 text-xl">•</span>
                    <span className="text-lg text-primary-white/80"><strong className="text-primary-yellow">12,036+ attendees</strong> joined the celebration, creating unmatched energy and enthusiasm.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-yellow mr-3 text-xl">•</span>
                    <span className="text-lg text-primary-white/80">Over <strong className="text-primary-yellow">₹1.2 crore in revenue</strong> was reported through dynamic stalls, proving the Fest as a platform for real business growth.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-yellow mr-3 text-xl">•</span>
                    <span className="text-lg text-primary-white/80"><strong className="text-primary-yellow">6 winning startups</strong> were recognized for their resilience and vision.</span>
                  </li>
                </ul>
                <p className="text-lg text-primary-white/80 leading-relaxed">
                  From endorsements by over <strong className="text-primary-yellow">70+ well-known influencers</strong> to <strong className="text-primary-yellow">25+ partnerships</strong> and masterclasses, Founders' Fest 2024 demonstrated that it is more than just an event—it's an ecosystem for nurturing ideas and encouraging collaborations.
                </p>
              </div>
            </motion.div>

            {/* More Than an Event, It's a Movement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">
                More Than an Event, It's a Movement
              </h2>
              <div className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-6 md:p-8">
                <p className="text-lg text-primary-white/80 leading-relaxed mb-4">
                  Participants aren't just showcasing products, they are building connections, gaining insights, and finding pathways to scale their businesses. The Mentors' Lounge provides an invaluable opportunity for personalized guidance, while FFest Awards recognize and celebrate exceptional startups that are driving change.
                </p>
                <p className="text-lg text-primary-white/80 leading-relaxed">
                  Founders' Fest's long-term impact is further amplified through initiatives like the Online Marketplace, where participants can continue showcasing and selling their products even after the event, ensuring sustained visibility and success.
                </p>
              </div>
            </motion.div>

            {/* Why Founders' Fest Matters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">
                Why Founders' Fest Matters
              </h2>
              <div className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-6 md:p-8">
                <p className="text-lg text-primary-white/80 leading-relaxed mb-4">
                  At its heart, Founders' Fest is about building a community—one that thrives on innovation, inclusivity, and collaboration. It's where established leaders and emerging founders meet, share stories, and inspire the entrepreneur in each of us.
                </p>
                <p className="text-lg text-primary-white/80 leading-relaxed">
                  As we look forward to the next edition of Founders' Fest on <strong className="text-primary-yellow">31st December 2025 & 1st January 2026</strong> at the <strong className="text-primary-yellow">Central Lawn, Public Gardens, Hyderabad</strong>, it's clear that the stage is set once again for ideas and groundbreaking ventures.
                </p>
                <p className="text-lg text-primary-white/80 leading-relaxed mt-4">
                  Whether you are an entrepreneur looking to scale, a creator starting out, or simply someone who believes in the power of dreams, Founders' Fest welcomes you to be a part of something truly extraordinary.
                </p>
              </div>
            </motion.div>

           
              
           
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default About
