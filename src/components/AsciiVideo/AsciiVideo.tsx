'use client'

import { useAscii } from '@/hooks'
import { characterRamps, cn, noop } from '@/utils'
import { useEffect, useRef, useState } from 'react'
import type { AsciiImageProps } from '../AsciiImage/AsciiImage'

export type AsciiVideoProps = Omit<AsciiImageProps, 'showImage'>

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
	const processRef = useRef(processSource)
	processRef.current = processSource

	useEffect(() => {
		videoRef.current ??= document.createElement('video')
		const video = videoRef.current

		let cancelled = false

		const update = () => {
			if (cancelled) return
			if (!video.videoWidth || !video.videoHeight) {
				video.requestVideoFrameCallback(update)
				return
			}

			setAscii(processRef.current(video))
			video.requestVideoFrameCallback(update)
		}

		video.crossOrigin = 'anonymous'
		video.loop = true
		video.muted = true
		video.autoplay = true
		video.playsInline = true
		video.src = src
		video.play().catch(noop)
		video.requestVideoFrameCallback(update)

		return () => {
			cancelled = true
			video.pause()
		}
	}, [src, setAscii])

	const handlePlayPause = () => {
		if (isPlaying) videoRef.current?.pause()
		else videoRef.current?.play()
		setIsPlaying(!isPlaying)
	}

	return (
		<pre
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role -- <pre> is the click-to-play/pause toggle
			role='button'
			tabIndex={0}
			className={cn('bg-cover bg-no-repeat w-fit text-[.4rem] cursor-pointer', className)}
			ref={preRef}
			onClick={handlePlayPause}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') handlePlayPause()
			}}
			{...props}
		>
			{ascii}
		</pre>
	)
}
