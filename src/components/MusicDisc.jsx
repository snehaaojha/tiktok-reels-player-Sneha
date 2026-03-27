import React from 'react'

export default function MusicDisc({ avatar, musicName, isPlaying }) {
  return (
    <div className="music-disc-wrapper">
      <div className={`music-disc ${isPlaying ? 'spinning' : ''}`}>
        <img src={avatar} alt="music disc" className="music-disc-img" />
        <div className="music-disc-center" />
      </div>
      <p className="music-name">♪ {musicName}</p>
    </div>
  )
}
