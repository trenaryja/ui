'use client'

import { cn } from '@/utils'
import { characterRamps, clampDimensions, getAscii, getFontDimensions } from '@/utils/ascii'
import { useEffect, useRef, useState } from 'react'
import { AsciiImageProps } from './AsciiImage'

type AsciiVideoProps = Omit<AsciiImageProps, 'showImage'>

export const AsciiVideo = ({
	src,
	maxHeight,
	maxWidth,
	characterRamp = characterRamps[0],
	reverseRamp,
	className,
	...props
}: AsciiVideoProps) => {
	const [ascii, setAscii] = useState('')
	const [isPlaying, setIsPlaying] = useState(true)
	const preRef = useRef<HTMLPreElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)

	const ramp = reverseRamp ? characterRamp.split('').reverse().join('') : characterRamp

	useEffect(() => {
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
			{...props}
		>
			{ascii}
		</pre>
	)
}
