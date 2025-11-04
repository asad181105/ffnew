import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.img
              src="/logo.png"
              alt="Founders Fest"
              whileHover={{ scale: 1.05 }}
              className="h-24 md:h-30 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group px-3 py-2 rounded-lg transition-all duration-300"
                >
                  {/* Yellow background box on hover and active */}
                  <motion.div
                    className={`absolute inset-0 bg-primary-yellow rounded-lg ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    transition={{ duration: 0.3 }}
                  />
                  <span
                    className={`relative z-10 font-gta font-medium text-xl transition-colors duration-300 ${
                      isActive
                        ? 'text-primary-black'
                        : 'text-primary-white group-hover:text-primary-black'
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-primary-white hover:text-primary-yellow transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative block px-4 py-2 rounded-lg transition-all duration-300 font-gta font-medium text-xl ${
                    isActive
                      ? 'bg-primary-yellow text-primary-black'
                      : 'text-primary-white hover:bg-primary-yellow hover:text-primary-black'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
