'use client'

import { characterRamps, cn, useAscii } from '@/utils'
import { useEffect, useRef, useState } from 'react'
import type { AsciiImageProps } from './AsciiImage'

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
	const [isPlaying, setIsPlaying] = useState(true)
	const videoRef = useRef<HTMLVideoElement>(null)
	const { preRef, ascii, setAscii, processSource } = useAscii({ characterRamp, reverseRamp, maxHeight, maxWidth })

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

			setAscii(processSource(video))
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
	}, [src, processSource, setAscii])

	const handlePlayPause = () => {
		if (isPlaying) videoRef.current?.pause()
		else videoRef.current?.play()
		setIsPlaying(!isPlaying)
	}

	return (
		<pre
			className={cn('bg-cover bg-no-repeat w-fit text-[.4rem] cursor-pointer', className)}
			ref={preRef}
			tabIndex={0}
			onClick={handlePlayPause}
			{...props}
		>
			{ascii}
		</pre>
	)
}
