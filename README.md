# TikTok Style Video Player

A responsive TikTok-style vertical video feed built using React.
This project replicates core reel functionalities such as smooth scrolling, video playback control, and user interactions.

---

## Demo Video

https://drive.google.com/file/d/1v6W5WbCCqGfoeZ6tLKyDen9Dm0HXib5r/view?usp=drive_link

---

## Screenshot

(Add screenshot.png in the root folder)

![App Screenshot](./screenshots.png)

---

## Features

* Vertical full-screen video feed (one video per viewport)
* Smooth scrolling with snap behavior
* Auto play and pause using IntersectionObserver
* Like functionality (button and double tap)
* Comment modal with basic interaction
* Mute and unmute toggle
* Background audio support per video
* Expandable captions ("Read more")
* Infinite scrolling loop
* Responsive layout (mobile-style centered UI)

---

## Tech Stack

* React (Vite)
* JavaScript (ES6+)
* CSS

---

## Setup Instructions

```bash
npm install
npm run dev
```

---

## Approach

* Implemented IntersectionObserver to track the active video and control playback
* Ensured only one video plays at a time to avoid performance issues
* Used reusable components such as VideoItem, ActionBar, and VideoFeed
* Handled browser autoplay restrictions for audio using user interaction
* Designed UI to mimic real-world short video platforms like TikTok/Reels

---

## Challenges Faced

* Synchronizing audio playback with video due to browser autoplay restrictions
* Preventing multiple videos from playing simultaneously
* Handling smooth infinite scrolling without visible jumps
* Maintaining correct video aspect ratio across different media

---

## Limitations

* Uses static data (no backend or API integration)
* Large video files increase repository size
* Audio is implemented separately for videos without built-in sound

---

## Author

Sneha Ojha
