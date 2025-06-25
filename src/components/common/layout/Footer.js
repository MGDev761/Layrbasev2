import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo/Triangle */}
            <div className="text-gray-900 text-sm">▲</div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link>
              <Link to="/docs" className="text-gray-600 hover:text-gray-900 text-sm">Docs</Link>
              <Link to="/guides" className="text-gray-600 hover:text-gray-900 text-sm">Guides</Link>
              <Link to="/help" className="text-gray-600 hover:text-gray-900 text-sm">Help</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</Link>
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                  Legal
                  <ChevronDownIcon className="ml-1 h-3 w-3" />
                </button>
              </div>
            </nav>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-gray-600 text-sm">All systems normal</span>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-3 text-xs text-gray-500">
          © 2025, LayrBase Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 