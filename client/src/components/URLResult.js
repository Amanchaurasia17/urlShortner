import React from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiDownload, FiBarChart2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import copy from 'copy-to-clipboard';
import { QRCodeSVG } from 'qrcode.react';

const URLResult = ({ result }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    copy(result.shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas');
    const svg = document.querySelector('#qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `qr-${result.shortCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('QR Code downloaded!');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-8 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          ✨ Your Short URL is Ready!
        </h2>
        <Link to={`/analytics/${result.shortCode}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all"
          >
            <FiBarChart2 />
            <span>View Analytics</span>
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Short URL Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Original URL
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 break-all">
              {result.originalUrl}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Short URL
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-3 font-mono text-purple-600 dark:text-purple-400 break-all">
                {result.shortUrl}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </motion.button>
            </div>
          </div>

          {result.expiresAt && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              ⏰ Expires: {new Date(result.expiresAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <QRCodeSVG
              id="qr-code-svg"
              value={result.shortUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadQR}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all"
          >
            <FiDownload />
            <span>Download QR Code</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default URLResult;
