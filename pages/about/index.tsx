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
        <meta name="description" content="Learn about Adventure Park Incubation Center and Founders Fest." />
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
                About Founders Fest
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Adventure Park Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">
                Adventure Park Incubated
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-primary-white/80 leading-relaxed mb-4">
                  Adventure Park Incubation Center is a leading hub for innovation and entrepreneurship, 
                  dedicated to nurturing the next generation of startups. We provide comprehensive support 
                  to aspiring founders through our incubation program, offering mentorship, resources, and 
                  a vibrant ecosystem for growth.
                </p>
                <p className="text-lg text-primary-white/80 leading-relaxed mb-4">
                  Our mission is to empower entrepreneurs by connecting them with the right mentors, 
                  investors, and resources needed to transform their ideas into successful businesses. 
                  We believe in fostering a culture of innovation, collaboration, and continuous learning.
                </p>
              </div>
            </motion.div>

            {/* Incubation Center Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">
                Incubation Center
              </h2>
              <div className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-8">
                <p className="text-lg text-primary-white/80 leading-relaxed mb-4">
                  Our state-of-the-art incubation center provides startups with:
                </p>
                <ul className="list-disc list-inside space-y-3 text-primary-white/80 text-lg">
                  <li>Co-working spaces and modern facilities</li>
                  <li>Access to experienced mentors and advisors</li>
                  <li>Networking opportunities with investors and industry leaders</li>
                  <li>Workshops and training programs</li>
                  <li>Funding support and investor connections</li>
                  <li>A supportive community of fellow entrepreneurs</li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">
                Contact Us
              </h2>
              <div className="bg-primary-black border-2 border-primary-yellow/30 rounded-lg p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Mail className="text-primary-yellow" size={24} />
                    <a
                      href="mailto:info@foundersfest.com"
                      className="text-primary-white/80 hover:text-primary-yellow transition-colors text-lg"
                    >
                      info@foundersfest.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="text-primary-yellow" size={24} />
                    <a
                      href="tel:+1234567890"
                      className="text-primary-white/80 hover:text-primary-yellow transition-colors text-lg"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                  <div className="flex items-center space-x-6 pt-4">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-white/80 hover:text-primary-yellow transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={28} />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-white/80 hover:text-primary-yellow transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={28} />
                    </a>
                  </div>
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

export default About
