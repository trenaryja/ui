'use client'

import { SVGProps, useEffect, useRef } from 'react'

export type ScaledTextProps = {
	lines: (
		| string
		| {
				text: string
				props?: SVGProps<SVGTextElement>
		  }
	)[]
	props?: React.SVGProps<SVGTextElement>
}

export const ScaledText = ({ lines, props }: ScaledTextProps) => {
	const refs = useRef<(SVGElement | null)[]>([])

	useEffect(() => {
		refs.current = refs.current.slice(0, lines.length)
	}, [lines])

	useEffect(() => {
		refs.current.forEach((svg) => {
			const text = svg?.querySelector('text')
			const bbox = text?.getBBox()
			svg?.setAttribute('viewBox', [bbox?.x, bbox?.y, bbox?.width, bbox?.height].join(' '))
		})
	}, [lines])

	return (
		<>
			{lines.map((line, i) => (
				<svg
					ref={(svg) => {
						refs.current[i] = svg
					}}
				>
					<text {...props} {...(typeof line === 'string' ? undefined : line.props)}>
						{typeof line === 'string' ? line : line.text}
					</text>
				</svg>
			))}
		</>
	)
}
