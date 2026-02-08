// src/components/WatermarkedVideo.jsx
import React from 'react';

export default function WatermarkedVideo({ src }) {
  const preventContext = (e) => e.preventDefault();
  return (
    <div className="media-card" onContextMenu={preventContext}>
      <div className="media-watermark">Serene Homes – Private Family Memory. Do Not Share.</div>
      <video
        className="media-video"
        src={src}
        controls
        controlsList="nodownload noplaybackrate"
      />
    </div>
  );
}
