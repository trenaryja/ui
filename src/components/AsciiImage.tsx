'use client'

import { characterRamps, cn, useAscii } from '@/utils'
import type { ComponentProps } from 'react'
import { useEffect } from 'react'
import type { LiteralUnion } from 'type-fest'

export type AsciiImageProps = ComponentProps<'pre'> & {
	src: string
	maxHeight?: number
	maxWidth?: number
	characterRamp?: LiteralUnion<(typeof characterRamps)[number], string>
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
	const { preRef, ascii, setAscii, processSource } = useAscii({ characterRamp, reverseRamp, maxHeight, maxWidth })

	useEffect(() => {
		const image = new Image()
		image.crossOrigin = 'Anonymous'

		image.onload = () => {
			setAscii(processSource(image))
		}

		image.src = src
	}, [src, processSource, setAscii])

	return (
		<pre
			className={cn('bg-cover bg-no-repeat w-fit text-[.4rem]', className)}
			ref={preRef}
			style={{ backgroundImage: showImage ? `url(${src})` : undefined, ...style }}
			{...props}
		>
			{ascii}
		</pre>
	)
}
