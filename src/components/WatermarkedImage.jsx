// src/components/WatermarkedImage.jsx
import React from 'react';

export default function WatermarkedImage({ src, alt }) {
  const preventContext = (e) => e.preventDefault();
  return (
    <div className="media-card" onContextMenu={preventContext}>
      <div className="media-watermark">Serene Homes – Private Family Memory. Do Not Share.</div>
      <img src={src} alt={alt} className="media-img" />
    </div>
  );
}
