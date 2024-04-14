'use client'

import React from 'react'
import { AsciiImageProps } from '..'
import { getAscii, getCharacterRamp } from '../AsciiImage/utils'
import { cn } from '../utils'

type AsciiVideoProps = Omit<AsciiImageProps, 'showImage'>

export const AsciiVideo = ({
  src,
  maxHeight = 50,
  maxWidth = 50,
  characterRamp = 'short',
  reverseRamp,
  preClassName,
}: AsciiVideoProps) => {
  const [ascii, setAscii] = React.useState('')
  const [isPlaying, setIsPlaying] = React.useState(true)
  const ref = React.useRef<React.ElementRef<'div'>>(null)
  const videoRef = React.useRef<React.ElementRef<'video'>>(document.createElement('video'))

  const _characterRamp = getCharacterRamp(characterRamp, reverseRamp)

  const update = React.useCallback(() => {
    const video = videoRef.current
    const multiplier = 10
    // TODO: getFontDimensions(ref) and use them when getting the ascii
    setAscii(getAscii(16 * multiplier, 3 * multiplier, video, _characterRamp))
    video.requestVideoFrameCallback(update)
  }, [videoRef])

  React.useEffect(() => {
    const video = videoRef.current
    video.crossOrigin = 'anonymous'
    // video.onload = () => {
    //   const { fontHeight, fontWidth } = getFontDimensions(ref)
    //   const { width, height } = clampDimensions({
    //     width: video.width,
    //     height: video.height,
    //     maxHeight,
    //     maxWidth,
    //     fontHeight,
    //     fontWidth,
    //   })
    //   const ascii = getAscii(width, height, video, _characterRamp)
    //   setAscii(ascii)
    // }
    video.loop = true
    video.muted = true
    video.autoplay = true
    video.playsInline = true
    video.src = src
    video.play()
    update()
  }, [src, maxHeight, maxWidth, _characterRamp, videoRef])

  const handlePlayPause = () => {
    isPlaying ? videoRef.current?.pause() : videoRef.current?.play()
    setIsPlaying(!isPlaying)
  }

  return (
    <div ref={ref} className='grid place-items-start'>
      <pre onClick={handlePlayPause} className={cn('bg-cover bg-no-repeat w-fit text-[.4rem]', preClassName)}>
        {ascii}
      </pre>
    </div>
  )
}
