import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLink, FiBarChart2, FiGrid, FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Header = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: FiLink },
    { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <FiLink className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold gradient-text">URLify</span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Dark mode toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? (
              <FiSun className="text-yellow-500 text-xl" />
            ) : (
              <FiMoon className="text-gray-700 text-xl" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
