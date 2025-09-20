'use client'

import { Suggest } from '@/types'
import { cn } from '@/utils'
import React from 'react'
import { characterRamps, clampDimensions, getAscii, getCharacterRamp, getFontDimensions } from './AsciiImage.utils'

export type AsciiImageProps = {
	src: string
	maxHeight?: number
	maxWidth?: number
	characterRamp?: Suggest<keyof typeof characterRamps, string>
	reverseRamp?: boolean
	showImage?: boolean
	className?: string
}

export const AsciiImage = ({
	src,
	maxHeight,
	maxWidth,
	characterRamp = 'short',
	reverseRamp,
	showImage,
	className,
}: AsciiImageProps) => {
	const [ascii, setAscii] = React.useState('')
	const ref = React.useRef<HTMLPreElement>(null)

	React.useEffect(() => {
		const image = new Image()
		image.crossOrigin = 'Anonymous'

		image.onload = () => {
			const { fontHeight, fontWidth } = getFontDimensions(ref)
			const ramp = getCharacterRamp(characterRamp, reverseRamp)
			const { width, height } = clampDimensions({
				width: image.width,
				height: image.height,
				maxHeight,
				maxWidth,
				fontHeight,
				fontWidth,
			})
			setAscii(getAscii(width, height, image, ramp))
		}

		image.src = src
	}, [src, maxHeight, maxWidth, characterRamp, reverseRamp])

	return (
		<pre
			ref={ref}
			className={cn('bg-cover bg-no-repeat w-fit text-[.4rem]', className)}
			style={{ backgroundImage: showImage ? `url(${src})` : undefined }}
		>
			{ascii}
		</pre>
	)
}
