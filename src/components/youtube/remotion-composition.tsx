<<<<<<< HEAD
"use client"

import type React from "react"
import { useEffect } from "react"

import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, Img, interpolate, spring } from "remotion"

interface ShortsCompositionProps {
  images: string[]
  audio?: string
  title?: string
  captions?: { text: string; startFrame: number; endFrame: number }[]
  duration?: number
  fps?: number
  transitionDuration?: number
  setCurrentFrame: (frame: number) => void // Add this line
}

export const ShortsComposition: React.FC<ShortsCompositionProps> = ({
  images,
  audio,
  title,
  captions = [],
  duration = 10,
  fps = 30,
  transitionDuration = 30,
  setCurrentFrame // Add this line
}) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

    useEffect(() => {
        setCurrentFrame(frame);
    }, [frame, setCurrentFrame]);

  // Calculate how many frames each image should be displayed
  const framesPerImage = Math.floor((duration * fps - (images.length - 1) * transitionDuration) / images.length)

  // Determine which image to show based on current frame
  const getImageIndexForFrame = (frame: number) => {
    let totalFrames = 0
    for (let i = 0; i < images.length; i++) {
      totalFrames += framesPerImage
      if (i < images.length - 1) {
        totalFrames += transitionDuration
      }
      if (frame < totalFrames) return i
    }
    return images.length - 1
  }

  // Get current caption based on frame
  const getCurrentCaption = () => {
    return captions.find((caption) => frame >= caption.startFrame && frame <= caption.endFrame)
  }

  const currentCaption = getCurrentCaption()
  const currentImageIndex = getImageIndexForFrame(frame)
  const nextImageIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : currentImageIndex

  // Calculate transition progress
  const transitionStart = framesPerImage * (currentImageIndex + 1) + transitionDuration * currentImageIndex
  const transitionProgress = interpolate(frame, [transitionStart, transitionStart + transitionDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Calculate title animation
  const titleOpacity = spring({
    frame: frame - 10,
    fps: fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
  })

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Current image */}
      <AbsoluteFill style={{ opacity: 1 - transitionProgress }}>
        <Img
          src={images[currentImageIndex]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Next image (for transition) */}
      {currentImageIndex < images.length - 1 && (
        <AbsoluteFill style={{ opacity: transitionProgress }}>
          <Img
            src={images[nextImageIndex]}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Title overlay */}
      {title && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "20px",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "10px 20px",
              borderRadius: "10px",
              maxWidth: "80%",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            <h1
              style={{
                color: "white",
                fontSize: "32px",
                margin: 0,
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              {title}
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {/* Captions */}
      {currentCaption && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "20px",
            paddingBottom: "80px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "10px 20px",
              borderRadius: "10px",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "white",
                fontSize: "24px",
                margin: 0,
                fontWeight: "medium",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              {currentCaption.text}
            </p>
          </div>
        </AbsoluteFill>
      )}

      {/* Audio */}
      {audio && <Audio src={audio} />}
    </AbsoluteFill>
  )
=======
"use client"

import type React from "react"
import { useEffect } from "react"

import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, Img, interpolate, spring } from "remotion"

interface ShortsCompositionProps {
  images: string[]
  audio?: string
  title?: string
  captions?: { text: string; startFrame: number; endFrame: number }[]
  duration?: number
  fps?: number
  transitionDuration?: number
  setCurrentFrame: (frame: number) => void // Add this line
}

export const ShortsComposition: React.FC<ShortsCompositionProps> = ({
  images,
  audio,
  title,
  captions = [],
  duration = 10,
  fps = 30,
  transitionDuration = 30,
  setCurrentFrame // Add this line
}) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

    useEffect(() => {
        setCurrentFrame(frame);
    }, [frame, setCurrentFrame]);

  // Calculate how many frames each image should be displayed
  const framesPerImage = Math.floor((duration * fps - (images.length - 1) * transitionDuration) / images.length)

  // Determine which image to show based on current frame
  const getImageIndexForFrame = (frame: number) => {
    let totalFrames = 0
    for (let i = 0; i < images.length; i++) {
      totalFrames += framesPerImage
      if (i < images.length - 1) {
        totalFrames += transitionDuration
      }
      if (frame < totalFrames) return i
    }
    return images.length - 1
  }

  // Get current caption based on frame
  const getCurrentCaption = () => {
    return captions.find((caption) => frame >= caption.startFrame && frame <= caption.endFrame)
  }

  const currentCaption = getCurrentCaption()
  const currentImageIndex = getImageIndexForFrame(frame)
  const nextImageIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : currentImageIndex

  // Calculate transition progress
  const transitionStart = framesPerImage * (currentImageIndex + 1) + transitionDuration * currentImageIndex
  const transitionProgress = interpolate(frame, [transitionStart, transitionStart + transitionDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Calculate title animation
  const titleOpacity = spring({
    frame: frame - 10,
    fps: fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
  })

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Current image */}
      <AbsoluteFill style={{ opacity: 1 - transitionProgress }}>
        <Img
          src={images[currentImageIndex]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Next image (for transition) */}
      {currentImageIndex < images.length - 1 && (
        <AbsoluteFill style={{ opacity: transitionProgress }}>
          <Img
            src={images[nextImageIndex]}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Title overlay */}
      {title && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "20px",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "10px 20px",
              borderRadius: "10px",
              maxWidth: "80%",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            <h1
              style={{
                color: "white",
                fontSize: "32px",
                margin: 0,
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              {title}
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {/* Captions */}
      {currentCaption && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "20px",
            paddingBottom: "80px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "10px 20px",
              borderRadius: "10px",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "white",
                fontSize: "24px",
                margin: 0,
                fontWeight: "medium",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              {currentCaption.text}
            </p>
          </div>
        </AbsoluteFill>
      )}

      {/* Audio */}
      {audio && <Audio src={audio} />}
    </AbsoluteFill>
  )
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
}