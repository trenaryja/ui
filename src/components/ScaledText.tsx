'use client'

import type { SVGProps } from 'react'
import { useEffect, useRef } from 'react'

export type ScaledTextProps = {
	lines: (
		| string
		| {
				text: string
				props?: SVGProps<SVGTextElement>
		  }
	)[]
	props?: SVGProps<SVGTextElement>
}

export const ScaledText = ({ lines, props }: ScaledTextProps) => {
	const refs = useRef<(SVGElement | null)[]>([])

	useEffect(() => {
		refs.current.forEach((svg) => {
			const text = svg?.querySelector('text')
			const bbox = text?.getBBox()
			svg?.setAttribute('viewBox', [bbox?.x, bbox?.y, bbox?.width, bbox?.height].join(' '))
		})
	}, [lines])

	return (
		<>
			{lines.map((line, i) => {
				const text = typeof line === 'string' ? line : line.text
				const key = typeof line === 'string' ? `s:${text}:${i}` : `o:${text}:${line.props?.id ?? ''}`
				return (
					<svg
						className='fill-current'
						key={key}
						ref={(svg) => {
							refs.current[i] = svg
						}}
					>
						<text {...props} {...(typeof line === 'string' ? undefined : line.props)}>
							{typeof line === 'string' ? line : line.text}
						</text>
					</svg>
				)
			})}
		</>
	)
}
