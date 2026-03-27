import React, { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import ActionBar from './ActionBar'
import UserInfo from './UserInfo'
import MusicDisc from './MusicDisc'
import ProgressBar from './ProgressBar'
import CommentModal from './CommentModal'

export default function VideoItem({ video, index, isActive, muted, setMuted, setItemRef }) {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIcon, setShowIcon] = useState(false)
  const [iconType, setIconType] = useState('play') // 'play' | 'pause'
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [commentsOpen, setCommentsOpen] = useState(false)
  // Like state lives here so double-tap and the action button share one source of truth
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(video.likes)
  const likedRef = useRef(false)
  const iconTimerRef = useRef(null)
  const lastTapRef = useRef(0)
  const singleTapTimerRef = useRef(null)
  const [doubleLiked, setDoubleLiked] = useState(false)
  const doubleLikeTimerRef = useRef(null)

  function triggerLike() {
    const nowLiked = !likedRef.current
    likedRef.current = nowLiked
    setLiked(nowLiked)
    setLikeCount(c => nowLiked ? c + 1 : c - 1)
  }

  // Play/pause based on visibility — controls both video and audio as one unit
  useEffect(() => {
    const vid = videoRef.current
    const aud = audioRef.current
    if (!vid) return

    if (isActive) {
      vid.muted = muted
      const raf = requestAnimationFrame(() => {
        vid.play().then(() => setIsPlaying(true)).catch(() => {})
        if (aud) {
          aud.muted = muted
          if (!muted) {
            aud.currentTime = vid.currentTime
            aud.play().catch(() => {})
          }
        }
      })
      return () => {
        // Cancel the pending play — prevents audio restarting after scroll-away
        cancelAnimationFrame(raf)
      }
    } else {
      // Pause both immediately — no rAF, no delay
      vid.pause()
      vid.currentTime = 0
      if (aud) { aud.pause(); aud.currentTime = 0 }
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mirror video pause/play events onto audio — covers manual tap-to-pause
  // and buffering stalls so audio never runs ahead of video
  useEffect(() => {
    const vid = videoRef.current
    const aud = audioRef.current
    if (!vid || !aud) return
    const onPause = () => aud.pause()
    const onPlay  = () => { if (!muted) aud.play().catch(() => {}) }
    vid.addEventListener('pause', onPause)
    vid.addEventListener('play',  onPlay)
    return () => {
      vid.removeEventListener('pause', onPause)
      vid.removeEventListener('play',  onPlay)
    }
  }, [muted])

  // Keep audio time in sync with video during playback
  useEffect(() => {
    const vid = videoRef.current
    const aud = audioRef.current
    if (!vid || !aud) return
    function syncTime() {
      if (Math.abs(aud.currentTime - vid.currentTime) > 0.3) {
        aud.currentTime = vid.currentTime
      }
    }
    vid.addEventListener('timeupdate', syncTime)
    return () => vid.removeEventListener('timeupdate', syncTime)
  }, [])

  const flashIcon = useCallback((type) => {
    setIconType(type)
    setShowIcon(true)
    clearTimeout(iconTimerRef.current)
    iconTimerRef.current = setTimeout(() => setShowIcon(false), 800)
  }, [])

  function handleTap(e) {
    // Ignore taps on interactive children
    if (e.target.closest('.action-bar, .user-info, .more-btn, .mute-btn')) return

    const now = Date.now()
    const DOUBLE_TAP_DELAY = 280

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap — cancel the pending single-tap timer first
      clearTimeout(singleTapTimerRef.current)
      lastTapRef.current = 0
      // Always show heart animation; only increment like if not already liked
      if (!likedRef.current) triggerLike()
      setDoubleLiked(true)
      clearTimeout(doubleLikeTimerRef.current)
      doubleLikeTimerRef.current = setTimeout(() => setDoubleLiked(false), 1000)
      return
    }

    lastTapRef.current = now

    // Delay single-tap action so a double-tap can cancel it
    singleTapTimerRef.current = setTimeout(() => {
      // If a second tap came in within the window, lastTapRef was reset to 0
      if (lastTapRef.current === 0) return
      const el = videoRef.current
      if (!el) return
      if (el.paused) {
        el.play().then(() => setIsPlaying(true)).catch(() => {})
        flashIcon('play')
      } else {
        el.pause()
        setIsPlaying(false)
        flashIcon('pause')
      }
    }, DOUBLE_TAP_DELAY)
  }

  function handleTimeUpdate() {
    const el = videoRef.current
    if (el) setCurrentTime(el.currentTime)
  }

  function handleLoadedMetadata() {
    const el = videoRef.current
    if (el) setDuration(el.duration)
  }

  useEffect(() => () => {
    clearTimeout(iconTimerRef.current)
    clearTimeout(doubleLikeTimerRef.current)
    clearTimeout(singleTapTimerRef.current)
  }, [])

  return (
    <div
      className="video-item"
      data-index={index}
      ref={(el) => setItemRef(el, index)}
      onClick={handleTap}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="video-skeleton">
          <div className="skeleton-shimmer" />
        </div>
      )}

      <video
        ref={videoRef}
        src={video.url}
        className="video-el"
        loop
        muted={muted}
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Hidden audio element — separate track synced to video */}
      <audio
        ref={audioRef}
        src={video.audio}
        loop
        muted
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Play/Pause flash */}
      <div className={`play-icon-overlay ${showIcon ? 'visible' : ''}`}>
        <span>{iconType === 'play' ? '▶' : '⏸'}</span>
      </div>

      {/* Double-tap heart */}
      {doubleLiked && (
        <div className="double-like-heart">❤️</div>
      )}

      {/* Mute button — everything happens synchronously inside the click gesture.
           el.muted + el.volume + el.play() must all be called here, not in useEffect,
           so the browser's autoplay policy allows audio to start. */}
      <button
        className="mute-btn"
        onClick={(e) => {
          e.stopPropagation()
          const vid = videoRef.current
          const aud = audioRef.current
          const next = !muted
          // Apply to video element synchronously
          if (vid) { vid.muted = next; vid.volume = next ? 0 : 1 }
          // Apply to audio element synchronously inside the gesture window
          if (aud) {
            aud.muted = next
            if (!next) {
              aud.currentTime = vid ? vid.currentTime : 0
              aud.play().catch(() => {})
            } else {
              aud.pause()
            }
          }
          setMuted(next)
        }}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {/* Bottom overlays */}
      <div className="video-overlays">
        <UserInfo username={video.username} caption={video.caption} />
        <MusicDisc avatar={video.avatar} musicName={video.musicName} isPlaying={isPlaying} />
      </div>

      {/* Right action bar */}
      <ActionBar
        liked={liked}
        likeCount={likeCount}
        onLike={triggerLike}
        comments={video.comments}
        shares={video.shares}
        bookmarks={video.bookmarks}
        onCommentClick={() => setCommentsOpen(true)}
      />

      {/* Progress bar */}
      <ProgressBar currentTime={currentTime} duration={duration} videoRef={videoRef} />

      {/* Comment modal — rendered in a portal to escape stacking context */}
      {commentsOpen && createPortal(
        <CommentModal
          videoId={video.id}
          commentCount={video.comments}
          onClose={() => setCommentsOpen(false)}
        />,
        document.body
      )}
    </div>
  )
}
