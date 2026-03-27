import React, { useState, useRef, useEffect } from 'react'

const MOCK_COMMENTS = [
  { id: 1, user: '@alex_dev',    text: 'This is absolutely fire 🔥🔥',                          likes: 342  },
  { id: 2, user: '@sarah_m',     text: "Can't stop watching this on repeat 😭",                  likes: 218  },
  { id: 3, user: '@techbro99',   text: 'The vibes are immaculate fr fr',                         likes: 97   },
  { id: 4, user: '@luna_art',    text: 'Okay but the editing on this?? 👏👏',                    likes: 561  },
  { id: 5, user: '@just_vibing', text: "POV: you found this at 3am and now you're here",         likes: 1204 },
  { id: 6, user: '@coder_girl',  text: 'Sending this to everyone I know',                        likes: 88   },
  { id: 7, user: '@wave_rider',  text: 'The cinematography here is insane 🎥',                   likes: 430  },
  { id: 8, user: '@pixel_pete',  text: 'Bro said hold my camera and delivered 📸',               likes: 275  },
]

export default function CommentModal({ onClose }) {
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Lock body scroll while modal is open — this is the key fix
  useEffect(() => {
    const feed = document.querySelector('.video-feed')
    const prevOverflow = feed ? feed.style.overflow : null

    // Disable scroll on the feed container
    if (feed) feed.style.overflow = 'hidden'

    return () => {
      // Restore on unmount
      if (feed) feed.style.overflow = prevOverflow ?? ''
    }
  }, [])

  // Stop ALL scroll/touch/wheel events from reaching the feed
  function stopProp(e) {
    e.stopPropagation()
  }

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setComments(prev => [{ id: Date.now(), user: '@you', text, likes: 0 }, ...prev])
    setInput('')
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  useEffect(() => {
    // Slight delay so the modal animation completes before focusing
    const t = setTimeout(() => inputRef.current?.focus(), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="comment-backdrop"
      onClick={handleBackdrop}
      onWheel={stopProp}
      onTouchMove={stopProp}
      onTouchStart={stopProp}
      onScroll={stopProp}
    >
      <div
        className="comment-modal"
        onClick={stopProp}
        onWheel={stopProp}
        onTouchMove={stopProp}
        onTouchStart={stopProp}
      >
        <div className="comment-handle" />

        <div className="comment-header">
          <span className="comment-title">{comments.length} comments</span>
          <button className="comment-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="comment-list" ref={listRef}>
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar">{c.user[1].toUpperCase()}</div>
              <div className="comment-body">
                <span className="comment-user">{c.user}</span>
                <p className="comment-text">{c.text}</p>
              </div>
              <div className="comment-likes">
                <span>❤️</span>
                <span>{c.likes > 0 ? c.likes : ''}</span>
              </div>
            </div>
          ))}
        </div>

        <form className="comment-input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="comment-input"
            type="text"
            placeholder="Add a comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={200}
          />
          <button
            type="submit"
            className={`comment-send ${input.trim() ? 'active' : ''}`}
            disabled={!input.trim()}
            aria-label="Post comment"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  )
}
