import React, { useRef, useEffect, useState, useCallback } from 'react'
import VideoItem from './VideoItem'
import { videos as initialVideos } from '../data/videos'

const COUNT = initialVideos.length
// Triple the list: scroll starts in the middle copy so both directions have room
const videoList = [...initialVideos, ...initialVideos, ...initialVideos]
const START_INDEX = COUNT // begin at the first item of the middle copy

export default function VideoFeed() {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(START_INDEX)
  const [muted, setMuted] = useState(true)
  const observerRef = useRef(null)
  const itemRefs = useRef([])
  const isJumping = useRef(false) // suppress observer during silent scroll reset

  // IntersectionObserver — marks the fully visible item as active
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isJumping.current) return
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number(entry.target.dataset.index)
            setActiveIndex(idx)

            // When we reach the last item of the first copy, silently jump to
            // the matching item in the middle copy (no visible change)
            if (idx <= 1) {
              silentJump(idx + COUNT)
            } else if (idx >= videoList.length - 2) {
              silentJump(idx - COUNT)
            }
          }
        })
      },
      { root: container, threshold: 0.6 }
    )

    itemRefs.current.forEach((el) => {
      if (el) observerRef.current.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  // Jump to equivalent position in the middle copy without animation
  function silentJump(targetIdx) {
    const el = itemRefs.current[targetIdx]
    const container = containerRef.current
    if (!el || !container) return
    isJumping.current = true
    container.scrollTop = el.offsetTop
    setActiveIndex(targetIdx)
    // Re-enable observer on next frame
    requestAnimationFrame(() => { isJumping.current = false })
  }

  // Keyboard navigation — wraps around
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault()
      }
      if (e.key === 'ArrowDown') {
        const next = activeIndex + 1 < videoList.length ? activeIndex + 1 : activeIndex
        itemRefs.current[next]?.scrollIntoView({ behavior: 'smooth' })
      }
      if (e.key === 'ArrowUp') {
        const prev = activeIndex - 1 >= 0 ? activeIndex - 1 : 0
        itemRefs.current[prev]?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex])

  const setItemRef = useCallback((el, i) => {
    itemRefs.current[i] = el
  }, [])

  // Scroll to the start index on mount (no animation)
  useEffect(() => {
    const el = itemRefs.current[START_INDEX]
    const container = containerRef.current
    if (el && container) container.scrollTop = el.offsetTop
  }, [])

  return (
    <div ref={containerRef} className="video-feed">
      {videoList.map((video, i) => (
        <VideoItem
          key={`${video.id}-${i}`}
          video={video}
          index={i}
          isActive={i === activeIndex}
          muted={muted}
          setMuted={setMuted}
          setItemRef={setItemRef}
        />
      ))}
    </div>
  )
}
