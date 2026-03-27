import React, { useRef } from 'react'

export default function ProgressBar({ currentTime, duration, videoRef }) {
  const trackRef = useRef(null)
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  function seek(e) {
    e.stopPropagation()
    const track = trackRef.current
    const el = videoRef?.current
    if (!track || !el || !duration) return
    const rect = track.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    el.currentTime = ratio * duration
  }

  return (
    <div
      className="progress-bar-track"
      ref={trackRef}
      onClick={seek}
      onTouchStart={seek}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      <div className="progress-bar-thumb" style={{ left: `${pct}%` }} />
    </div>
  )
}
