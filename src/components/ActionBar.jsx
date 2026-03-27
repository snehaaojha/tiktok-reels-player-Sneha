import React, { useState } from 'react'

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

// Clean SVG icons — no emoji, crisp at all sizes
const Icons = {
  heart: (filled) => (
    <svg viewBox="0 0 24 24" fill={filled ? '#fe2c55' : 'none'} stroke={filled ? '#fe2c55' : '#fff'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  comment: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  share: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  bookmark: (filled) => (
    <svg viewBox="0 0 24 24" fill={filled ? '#ffcc00' : 'none'} stroke={filled ? '#ffcc00' : '#fff'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
}

export default function ActionBar({ liked, likeCount, onLike, comments, shares, bookmarks, onCommentClick }) {
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(bookmarks)

  function handleBookmark() {
    setBookmarked(prev => {
      setBookmarkCount(c => prev ? c - 1 : c + 1)
      return !prev
    })
  }

  return (
    <div className="action-bar">
      <button
        className={`action-btn ${liked ? 'liked' : ''}`}
        onClick={(e) => { e.stopPropagation(); onLike() }}
        aria-label="Like"
      >
        <span className="action-icon">{Icons.heart(liked)}</span>
        <span className="action-count">{formatCount(likeCount)}</span>
      </button>

      <button
        className="action-btn"
        onClick={(e) => { e.stopPropagation(); onCommentClick() }}
        aria-label="Comments"
      >
        <span className="action-icon">{Icons.comment()}</span>
        <span className="action-count">{formatCount(comments)}</span>
      </button>

      <button
        className="action-btn"
        onClick={(e) => e.stopPropagation()}
        aria-label="Share"
      >
        <span className="action-icon">{Icons.share()}</span>
        <span className="action-count">{formatCount(shares)}</span>
      </button>

      <button
        className={`action-btn ${bookmarked ? 'bookmarked' : ''}`}
        onClick={(e) => { e.stopPropagation(); handleBookmark() }}
        aria-label="Bookmark"
      >
        <span className="action-icon">{Icons.bookmark(bookmarked)}</span>
        <span className="action-count">{formatCount(bookmarkCount)}</span>
      </button>
    </div>
  )
}
