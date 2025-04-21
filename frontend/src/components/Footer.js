import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-10">
          
          {/* Follow Us Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:underline">About BookFlow</a></li>
              <li><a href="/terms" className="hover:underline">Terms and Conditions</a></li>
              <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/safety" className="hover:underline">Safety Tips</a></li>
              <li><a href="/buy-used-books" className="hover:underline">Buy Second Hand Books Online In India</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="text-center text-gray-400 py-4 border-t border-gray-700 text-xs">
        © {new Date().getFullYear()} Vidhyarthi Mitram. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
