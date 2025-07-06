import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-10 py-4">
      <div className="container">
        <div className="row justify-content-between">
          {/* Follow Us Section */}
          <div className="col-12 col-md-4 mb-4">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-600">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-12 col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-white hover:underline">About Us</a></li>
              <li><a href="/terms" className="text-white hover:underline">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-white hover:underline">Privacy Policy</a></li>
              <li><a href="/safety" className="text-white hover:underline">Safety Tips</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 py-4 border-t border-gray-700 text-xs">
        © {new Date().getFullYear()} Vidhyarthi Mitram. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
