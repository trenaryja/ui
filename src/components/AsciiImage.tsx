'use client'

import type { Suggest } from '@/types'
import { cn } from '@/utils'
import { characterRamps, clampDimensions, getAscii, getFontDimensions } from '@/utils/ascii'
import type { ComponentProps } from 'react'
import { useEffect, useRef, useState } from 'react'

export type AsciiImageProps = ComponentProps<'pre'> & {
	src: string
	maxHeight?: number
	maxWidth?: number
	characterRamp?: Suggest<(typeof characterRamps)[number], string>
	reverseRamp?: boolean
	showImage?: boolean
}

export const AsciiImage = ({
	src,
	maxHeight,
	maxWidth,
	characterRamp = characterRamps[0],
	reverseRamp,
	showImage,
	className,
	style,
	...props
}: AsciiImageProps) => {
	const [ascii, setAscii] = useState('')
	const ref = useRef<HTMLPreElement>(null)

	useEffect(() => {
		const image = new Image()
		image.crossOrigin = 'Anonymous'

		image.onload = () => {
			const { fontHeight, fontWidth } = getFontDimensions(ref)
			const ramp = reverseRamp ? characterRamp.split('').reverse().join('') : characterRamp
			const { width, height } = clampDimensions({
				width: image.width,
				height: image.height,
				maxHeight,
				maxWidth,
				fontHeight,
				fontWidth,
			})
			setAscii(getAscii({ width, height, src: image, characterRamp: ramp }))
		}

		image.src = src
	}, [src, maxHeight, maxWidth, characterRamp, reverseRamp])

	return (
		<pre
			className={cn('bg-cover bg-no-repeat w-fit text-[.4rem]', className)}
			ref={ref}
			style={{ backgroundImage: showImage ? `url(${src})` : undefined, ...style }}
			{...props}
		>
			{ascii}
		</pre>
	)
}
