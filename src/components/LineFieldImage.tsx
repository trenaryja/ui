'use client'

import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'

export type LineFieldImageProps = ComponentProps<'svg'> & {
	src: string
	cellSize?: number
	strokeWidth?: number
	matchStrokeWidth?: boolean
	showImage?: boolean
}

type ImgData = { width: number; height: number; lines: string }

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
			const { width: w, height: h } = img
			const nx = Math.ceil(w / cellSize)
			const ny = Math.ceil(h / cellSize)
			const canvas = document.createElement('canvas')
			canvas.width = nx
			canvas.height = ny
			const ctx = canvas.getContext('2d')!
			ctx.drawImage(img, 0, 0, nx, ny)
			const { data } = ctx.getImageData(0, 0, nx, ny)

			let lines = ''

			for (let y = 0; y < ny; y++) {
				for (let x = 0; x < nx; x++) {
					const i = (y * nx + x) * 4
					const brightness = 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2]
					const isDark = brightness < 128
					const angle = isDark ? Math.PI / 4 : -Math.PI / 4
					const cx = (x + 0.5) * (w / nx)
					const cy = (y + 0.5) * (h / ny)
					const len = cellSize * 1.4
					const dx = (len / 2) * Math.cos(angle)
					const dy = (len / 2) * Math.sin(angle)
					lines += `<line x1="${cx - dx}" y1="${cy - dy}" x2="${cx + dx}" y2="${cy + dy}" />\n`
				}
			}

			setImgData({ width: w, height: h, lines })
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
