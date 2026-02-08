// src/components/StoryList.jsx
import React from 'react';

export default function StoryList({ stories }) {
  if (!stories.length) return <p className="empty">No stories added yet.</p>;
  return (
    <div className="story-list">
      {stories.map((s) => (
        <div key={s._id} className="story-card">
          <div className="story-header">
            <h3>{s.title || 'Memory'}</h3>
            <span className="story-meta">
              {s.authorName && <span>{s.authorName}</span>}
              {s.createdAt && (
                <span>
                  {' · '}
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              )}
            </span>
          </div>
          <p>{s.content}</p>
        </div>
      ))}
    </div>
  );
}
