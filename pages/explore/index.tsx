import { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EventCard from '@/components/EventCard'
import { motion } from 'framer-motion'

const Explore: NextPage = () => {
  // Placeholder events - can be replaced with dynamic data later
  const placeholderEvents = [
    {
      title: 'Startup Showcase',
      date: 'December 31, 2025',
      time: '10:00 AM - 12:00 PM',
      location: 'Main Hall',
      description: 'Discover innovative startups and their groundbreaking solutions.',
    },
    {
      title: 'Networking Session',
      date: 'December 31, 2025',
      time: '2:00 PM - 4:00 PM',
      location: 'Lounge Area',
      description: 'Connect with entrepreneurs, investors, and industry leaders.',
    },
    {
      title: 'Keynote Talks',
      date: 'January 1, 2026',
      time: '9:00 AM - 11:00 AM',
      location: 'Auditorium',
      description: 'Inspiring talks from successful founders and thought leaders.',
    },
    {
      title: 'Pitch Competition',
      date: 'January 1, 2026',
      time: '1:00 PM - 5:00 PM',
      location: 'Competition Hall',
      description: 'Watch aspiring entrepreneurs pitch their ideas to a panel of judges.',
    },
  ]

  return (
    <>
      <Head>
        <title>Explore | Founders Fest 2025-26</title>
        <meta name="description" content="Explore Founders Fest - Networking, startup showcases, talks, and competitions." />
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
                Explore Founders Fest
              </h1>
              <p className="text-lg md:text-xl text-primary-white/80 max-w-3xl mx-auto">
                Founders Fest is a celebration of innovation, entrepreneurship, and collaboration. 
                Join us for two days filled with networking opportunities, startup showcases, 
                inspiring talks, and exciting competitions. Connect with fellow founders, 
                investors, and ecosystem members to ignite new partnerships and build the future together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-4">
                What to Expect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-6 hover:border-primary-yellow transition-all duration-300"
                >
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold text-primary-yellow mb-2">Networking</h3>
                  <p className="text-primary-white/80 text-sm">
                    Connect with entrepreneurs, investors, and ecosystem members.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-6 hover:border-primary-yellow transition-all duration-300"
                >
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-primary-yellow mb-2">Startup Showcases</h3>
                  <p className="text-primary-white/80 text-sm">
                    Discover innovative startups and their groundbreaking solutions.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-6 hover:border-primary-yellow transition-all duration-300"
                >
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-bold text-primary-yellow mb-2">Talks</h3>
                  <p className="text-primary-white/80 text-sm">
                    Learn from successful founders and industry thought leaders.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-6 hover:border-primary-yellow transition-all duration-300"
                >
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-xl font-bold text-primary-yellow mb-2">Competitions</h3>
                  <p className="text-primary-white/80 text-sm">
                    Witness exciting pitch competitions and innovation challenges.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-primary-black/50 to-primary-black">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-4">
                Upcoming Events
              </h2>
              <p className="text-primary-white/80 max-w-2xl mx-auto">
                Check out our schedule of events for Founders Fest 2025-26.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {placeholderEvents.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Explore
