// src/components/MediaGrid.jsx
import React, { useState } from 'react';
import WatermarkedImage from './WatermarkedImage.jsx';
import WatermarkedVideo from './WatermarkedVideo.jsx';

export default function MediaGrid({ items, type }) {
  const filtered = items.filter((m) => m.type === type);
  const [modalItem, setModalItem] = useState(null);

  if (!filtered.length) return <p className="empty">No {type === 'photo' ? 'photos' : 'videos'} yet.</p>;

  return (
    <>
      <div className="media-grid">
        {filtered.map((m) => (
          <div key={m._id} className="media-clickable" onClick={() => setModalItem(m)}>
            {type === 'photo' ? (
              <WatermarkedImage src={m.url} alt={m.title || 'Photo'} />
            ) : (
              <WatermarkedVideo src={m.url} />
            )}
            {m.title && <div className="media-title">{m.title}</div>}
          </div>
        ))}
      </div>

      {modalItem && (
        <div className="modal-backdrop" onClick={() => setModalItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalItem(null)}>
              ✕
            </button>
            {type === 'photo' ? (
              <WatermarkedImage src={modalItem.url} alt={modalItem.title || ''} />
            ) : (
              <WatermarkedVideo src={modalItem.url} />
            )}
            {modalItem.title && <h3>{modalItem.title}</h3>}
            {modalItem.description && <p>{modalItem.description}</p>}
          </div>
        </div>
      )}
    </>
  );
}
