'use client'

import { cn } from '@/utils'
import React from 'react'
import { AsciiImageProps } from './AsciiImage'
import { clampDimensions, getAscii, getCharacterRamp, getFontDimensions } from './AsciiImage.utils'

type AsciiVideoProps = Omit<AsciiImageProps, 'showImage'>

export const AsciiVideo = ({
	src,
	maxHeight,
	maxWidth,
	characterRamp = 'short',
	reverseRamp,
	className,
}: AsciiVideoProps) => {
	const [ascii, setAscii] = React.useState('')
	const [isPlaying, setIsPlaying] = React.useState(true)
	const preRef = React.useRef<HTMLPreElement>(null)
	const videoRef = React.useRef<HTMLVideoElement>(null)

	const ramp = getCharacterRamp(characterRamp, reverseRamp)

	React.useEffect(() => {
		if (!videoRef.current) videoRef.current = document.createElement('video')
		const video = videoRef.current

		let cancelled = false

		const update = () => {
			if (cancelled) return
			if (!video.videoWidth || !video.videoHeight) {
				video.requestVideoFrameCallback(update)
				return
			}

			const { fontHeight, fontWidth } = getFontDimensions(preRef)
			const { width, height } = clampDimensions({
				width: video.videoWidth,
				height: video.videoHeight,
				maxHeight,
				maxWidth,
				fontHeight,
				fontWidth,
			})

			setAscii(getAscii(width, height, video, ramp))
			video.requestVideoFrameCallback(update)
		}

		video.crossOrigin = 'anonymous'
		video.loop = true
		video.muted = true
		video.autoplay = true
		video.playsInline = true
		video.src = src
		video.play()
		video.requestVideoFrameCallback(update)

		return () => {
			cancelled = true
			video.pause()
		}
	}, [src, maxHeight, maxWidth, ramp])

	const handlePlayPause = () => {
		if (isPlaying) videoRef.current?.pause()
		else videoRef.current?.play()
		setIsPlaying(!isPlaying)
	}

	return (
		<pre
			ref={preRef}
			onClick={handlePlayPause}
			className={cn('bg-cover bg-no-repeat w-fit text-[.4rem] cursor-pointer', className)}
		>
			{ascii}
		</pre>
	)
}
