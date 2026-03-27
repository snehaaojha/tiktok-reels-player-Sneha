import React, { useState } from 'react'

export default function UserInfo({ username, caption }) {
  const [expanded, setExpanded] = useState(false)
  const [following, setFollowing] = useState(false)
  const isLong = caption.length > 80

  return (
    <div className="user-info">
      <div className="username-row">
        <span className="username">{username}</span>
        <button
          className={`follow-btn ${following ? 'following' : ''}`}
          onClick={(e) => { e.stopPropagation(); setFollowing(f => !f) }}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Caption — clamp when collapsed, full text when expanded */}
      <p className={`caption ${expanded ? 'expanded' : ''}`}>
        {caption}
      </p>

      {/* Toggle button sits outside <p> so it never fights line-clamp */}
      {isLong && (
        <button
          className="more-btn"
          onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
        >
          {expanded ? 'less' : '...more'}
        </button>
      )}
    </div>
  )
}
