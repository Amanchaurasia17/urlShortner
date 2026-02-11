import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLink, FiCopy, FiCheck, FiDownload, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import copy from 'copy-to-clipboard';
import { urlAPI } from '../services/api';
import QRCodeDisplay from '../components/QRCodeDisplay';
import URLResult from '../components/URLResult';

const Home = () => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    
    try {
      const data = {
        originalUrl: url,
        ...(customAlias && { customAlias }),
        ...(expiresIn && { expiresIn: parseInt(expiresIn) }),
        ...(tags && { tags: tags.split(',').map(t => t.trim()) })
      };

      const response = await urlAPI.shorten(data);
      setResult(response.data);
      toast.success('URL shortened successfully!');
      
      // Reset form
      setUrl('');
      setCustomAlias('');
      setExpiresIn('');
      setTags('');
    } catch (error) {
      toast.error(error.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Shorten Your URLs</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
          Fast, secure, and feature-rich URL shortening with analytics
        </p>
        <div className="flex items-center justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Free Forever</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">No Signup Required</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Analytics Included</span>
          </div>
        </div>
      </motion.div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your long URL
            </label>
            <div className="relative">
              <FiLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className="input-field pl-12"
                required
              />
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
          >
            {showAdvanced ? '- Hide' : '+ Show'} Advanced Options
          </button>

          {/* Advanced Options */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Custom Alias */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Alias (Optional)
                  </label>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-custom-link"
                    className="input-field"
                    pattern="[a-zA-Z0-9-_]+"
                  />
                  <p className="text-xs text-gray-500 mt-1">Letters, numbers, hyphens, and underscores only</p>
                </div>

                {/* Expiration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expires In (Days)
                  </label>
                  <input
                    type="number"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    placeholder="30"
                    className="input-field"
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (Optional)
                </label>
                <div className="relative">
                  <FiTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="marketing, campaign, social"
                    className="input-field pl-12"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Shortening...
              </span>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>
      </motion.div>

      {/* Result Display */}
      {result && <URLResult result={result} />}

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
      >
        {[
          {
            icon: '🚀',
            title: 'Lightning Fast',
            description: 'Redis-powered caching for instant redirects'
          },
          {
            icon: '📊',
            title: 'Detailed Analytics',
            description: 'Track clicks, devices, locations, and more'
          },
          {
            icon: '🔒',
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security and 99.9% uptime'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
