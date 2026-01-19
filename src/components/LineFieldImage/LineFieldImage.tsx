'use client'

import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'
import type { ImgData } from './LineFieldImage.utils'
import { processImageToLines } from './LineFieldImage.utils'

export type LineFieldImageProps = ComponentProps<'svg'> & {
	src: string
	cellSize?: number
	strokeWidth?: number
	matchStrokeWidth?: boolean
	showImage?: boolean
}

export const LineFieldImage = ({
	src,
	cellSize = 10,
	strokeWidth = 1,
	matchStrokeWidth = true,
	showImage,
	className,
	style,
	...props
}: LineFieldImageProps) => {
	const [imgData, setImgData] = useState<ImgData | null>(null)

	useEffect(() => {
		const img = new Image()
		img.crossOrigin = 'Anonymous'

		img.onload = () => {
			processImageToLines(img, cellSize, setImgData)
		}

		img.src = src
	}, [src, cellSize])

	if (!imgData) return null

	const effectiveStroke = matchStrokeWidth ? cellSize / 3 : strokeWidth

	return (
		<div
			className={cn(showImage && 'bg-center bg-contain bg-no-repeat')}
			style={{ backgroundImage: showImage ? `url(${src})` : undefined, ...style }}
		>
			<svg
				className={cn('stroke-base-content size-full', className)}
				dangerouslySetInnerHTML={{ __html: `<g>${imgData.lines}</g>` }}
				preserveAspectRatio='xMidYMid meet'
				strokeLinecap='square'
				strokeWidth={effectiveStroke}
				viewBox={`0 0 ${imgData.width} ${imgData.height}`}
				{...props}
			/>
		</div>
	)
}
