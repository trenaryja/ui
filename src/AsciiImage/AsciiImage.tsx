'use client'

import { useEffect, useRef, useState } from 'react'
import { AnyOther, cn } from '../utils'
import { characterRamps, clampDimensions, getAscii, getCharacterRamp, getFontDimensions } from './utils'

export type AsciiImageProps = {
	src: string
	maxHeight?: number
	maxWidth?: number
	characterRamp?: keyof typeof characterRamps | AnyOther<string>
	reverseRamp?: boolean
	showImage?: boolean
	preClassName?: string
}

export const AsciiImage = ({
	src,
	maxHeight = 50,
	maxWidth = 50,
	characterRamp = 'short',
	reverseRamp,
	showImage,
	preClassName,
}: AsciiImageProps) => {
	const [ascii, setAscii] = useState('')
	const ref = useRef<HTMLDivElement>(null)

	const _characterRamp = getCharacterRamp(characterRamp, reverseRamp)

	useEffect(() => {
		const image = new Image()
		image.crossOrigin = 'Anonymous'
		image.onload = () => {
			const { fontHeight, fontWidth } = getFontDimensions(ref)
			const { width, height } = clampDimensions({
				width: image.width,
				height: image.height,
				maxHeight,
				maxWidth,
				fontHeight,
				fontWidth,
			})
			const ascii = getAscii(width, height, image, _characterRamp)
			setAscii(ascii)
		}
		image.src = src
	}, [src, maxHeight, maxWidth, _characterRamp])

	return (
		<div ref={ref} className='grid place-items-start'>
			<pre
				className={cn('bg-cover bg-no-repeat w-fit text-[.4rem]', preClassName)}
				style={{ backgroundImage: showImage ? `url(${src})` : '' }}
			>
				{ascii}
			</pre>
		</div>
	)
}
