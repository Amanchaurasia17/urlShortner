import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeDisplay = ({ url, size = 200 }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg inline-block">
      <QRCodeSVG
        value={url}
        size={size}
        level="H"
        includeMargin={true}
      />
    </div>
  );
};

export default QRCodeDisplay;
