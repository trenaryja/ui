import type { SVGProps } from 'react'
import iconSvg from './JTIcon.svg?raw'

const pathData = iconSvg.match(/ d="([^"]*)"/)?.[1] ?? ''

export const JTIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1650 1450' fill='currentColor' {...props}>
		<path d={pathData} />
	</svg>
)
