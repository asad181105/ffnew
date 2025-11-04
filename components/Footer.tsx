import Link from 'next/link'
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react'

const Footer = () => {
  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
  ]

  return (
    <footer className="bg-primary-black border-t border-primary-yellow/20 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-primary-yellow text-lg font-bold mb-4">About</h3>
            <p className="text-primary-white/80 text-sm leading-relaxed">
              EdVenture Park Incubation India's First and Favourite Student Startup Incubator introducing India's first Pre Incubation Program, tailored to suit the needs of the STUDENTS!
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-primary-yellow text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-white/80 hover:text-primary-yellow transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h3 className="text-primary-yellow text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="text-primary-yellow" size={18} />
                <a
                  href="mailto:info@foundersfest.com"
                  className="text-primary-white/80 hover:text-primary-yellow transition-colors duration-300 text-sm"
                >
                  info@foundersfest.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-primary-yellow" size={18} />
                <a
                  href="tel:+1234567890"
                  className="text-primary-white/80 hover:text-primary-yellow transition-colors duration-300 text-sm"
                >
                  +91 63098 06633
                </a>
              </li>
              <li className="flex items-center space-x-4 pt-2">
                <a
                  href="https://www.instagram.com/founders.fest?igsh=NjZjZDhrbDE1M2Nt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-white/80 hover:text-primary-yellow transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/company/edventure-park/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-white/80 hover:text-primary-yellow transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-primary-yellow/20 mt-8 pt-8 text-center">
          <p className="text-primary-white/60 text-sm">
            © 2025 Founders Fest | All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
