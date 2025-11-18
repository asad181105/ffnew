import { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import InteractiveSelector from '@/components/ui/interactive-selector'
import { ShoppingBag, Mic, Users, Award, Network } from 'lucide-react'
import type { SelectorOption } from '@/components/ui/interactive-selector'

type ImpactStat = { id: number; value: string; label: string; order?: number | null; visible?: boolean | null }
type InteractiveSelectorOption = { id: number; title: string; description: string; image_url: string; icon_name?: string | null; order?: number | null; visible?: boolean | null }

const iconMap: Record<string, React.ReactNode> = {
  ShoppingBag: <ShoppingBag size={24} className="text-primary-white" />,
  Mic: <Mic size={24} className="text-primary-white" />,
  Users: <Users size={24} className="text-primary-white" />,
  Award: <Award size={24} className="text-primary-white" />,
  Network: <Network size={24} className="text-primary-white" />,
}

const Home: NextPage = () => {
  const [whyContent, setWhyContent] = useState<Record<string, string>>({})
  const [pageSections, setPageSections] = useState<Record<string, string>>({})
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([])
  const [interactiveSelectorSettings, setInteractiveSelectorSettings] = useState<Record<string, string>>({})
  const [interactiveSelectorOptions, setInteractiveSelectorOptions] = useState<SelectorOption[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const [contentRes, sectionsRes, statsRes, selectorSettingsRes, selectorOptionsRes] = await Promise.all([
        supabase.from('home_page_content').select('*'),
        supabase.from('about_page_sections').select('*'),
        supabase.from('about_impact_stats').select('*').order('order', { ascending: true }),
        supabase.from('home_interactive_selector_settings').select('*'),
        supabase.from('home_interactive_selector_options').select('*').order('order', { ascending: true }),
      ])
      if (!mounted) return
      const mapped = (contentRes.data || []).reduce((acc: any, row: any) => {
        acc[row.key] = row.value
        return acc
      }, {})
      if (Object.keys(mapped).length === 0) {
        setWhyContent({
          section1_headline: 'For the dreamers who dare and the doers who deliver',
          section1_subheadline: 'Hyderabad is building something big. Are you in?',
          section1_content: 'Let\'s be honest: building a business is lonely work. You have the vision, but you also have the late nights, the doubts, and the grind. Founders\' Fest isn\'t just another conference with people in suits talking to you. It\'s a gathering of the people who are actually in the arena.',
          section1_content_2: 'This is where Hyderabad\'s hustle finds a home. Whether you are coding your MVP in a cafe in Hitech City, running a small business from your living room, or looking to scale your startup to the moon, you belong here.',
        })
      } else {
        setWhyContent(mapped)
      }
      const sectionsMapped = (sectionsRes.data || []).reduce((acc: any, row: any) => {
        acc[row.key] = row.value
        return acc
      }, {})
      setPageSections(sectionsMapped)
      setImpactStats((statsRes.data || []) as ImpactStat[])
      
      // Interactive Selector settings
      const selectorSettingsMapped = (selectorSettingsRes.data || []).reduce((acc: any, row: any) => {
        acc[row.key] = row.value
        return acc
      }, {})
      setInteractiveSelectorSettings(selectorSettingsMapped)
      
      // Interactive Selector options
      const options = (selectorOptionsRes.data || []) as InteractiveSelectorOption[]
      const visibleOptions = options.filter((opt) => opt.visible !== false)
      const mappedOptions: SelectorOption[] = visibleOptions.map((opt) => ({
        title: opt.title,
        description: opt.description,
        image: opt.image_url,
        icon: opt.icon_name && iconMap[opt.icon_name] ? iconMap[opt.icon_name] : <ShoppingBag size={24} className="text-primary-white" />,
      }))
      setInteractiveSelectorOptions(mappedOptions)
    }
    load()
    return () => { mounted = false }
  }, [])

  const visibleStats = impactStats.filter((s) => s.visible !== false)

  return (
    <div style={{ margin: 0, padding: 0, background: 'transparent' }}>
      <Head>
        <title>Founders Fest 2025-26 | Ignite. Build. Celebrate.</title>
        <meta name="description" content="Founders Fest 2025-26 - Two days of innovation, networking, and celebration on December 31, 2025 and January 1, 2026." />
      </Head>
      <main style={{ background: 'transparent', margin: 0, padding: 0, position: 'relative' }} className="pt-16 md:pt-0">
        <Navbar variant="floating" />
        <Hero />
        {/* Section 1: For the dreamers who dare */}
        <section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-primary-yellow mb-3">
                {whyContent.section1_headline || 'For the dreamers who dare and the doers who deliver'}
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-6">
                {whyContent.section1_subheadline || 'Hyderabad is building something big. Are you in?'}
              </h3>
              <div className="text-base md:text-lg text-white/80 leading-relaxed max-w-4xl mx-auto space-y-4">
                <p>
                  {whyContent.section1_content || 'Let\'s be honest: building a business is lonely work. You have the vision, but you also have the late nights, the doubts, and the grind. Founders\' Fest isn\'t just another conference with people in suits talking to you. It\'s a gathering of the people who are actually in the arena.'}
                </p>
                <p>
                  {whyContent.section1_content_2 || 'This is where Hyderabad\'s hustle finds a home. Whether you are coding your MVP in a cafe in Hitech City, running a small business from your living room, or looking to scale your startup to the moon, you belong here.'}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why We Do This Quote Section */}
        <section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-4xl mx-auto">
                {pageSections.why_we_do_this_content || 'We believe that the person standing next to you at a coffee stall might just be your future co-founder. We believe that one conversation can unlock the door you\'ve been banging on for months.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* The Proof is in the People Section */}
        <section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
          <div className="container mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-primary-yellow mb-6 text-center"
            >
              {pageSections.proof_title || 'The Proof is in the People (2023 & 2024)'}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {visibleStats.map((stat, idx) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us for the Next Chapter Section */}
        <section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-primary-yellow mb-4">
                {pageSections.join_next_chapter_title || 'Join Us for the Next Chapter'}
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-base md:text-lg text-white">
                  <strong className="text-primary-yellow">Date:</strong> {pageSections.join_next_chapter_date || 'Dec 31st, 2025 & Jan 1st, 2026'}
                </p>
                <p className="text-base md:text-lg text-white">
                  <strong className="text-primary-yellow">Venue:</strong> {pageSections.join_next_chapter_venue || 'Public Gardens, Nampally, Hyderabad.'}
                </p>
              </div>
              <p className="text-base md:text-lg text-white/80 mb-6">
                {pageSections.join_next_chapter_content || 'Don\'t just watch Hyderabad grow. Be the reason it grows.'}
              </p>
            </motion.div>
          </div>
        </section>
        {/* Interactive Selector Section */}
        {interactiveSelectorOptions.length > 0 && (
          <section className="py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
            <InteractiveSelector
              title={interactiveSelectorSettings.title || "Experience Founders Fest"}
              subtitle={interactiveSelectorSettings.subtitle || "Discover what makes Founders Fest the ultimate gathering for entrepreneurs, innovators, and dreamers."}
              options={interactiveSelectorOptions}
            />
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Home
