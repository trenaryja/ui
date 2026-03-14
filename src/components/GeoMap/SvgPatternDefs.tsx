import { colorMix } from '@/utils'

export const svgPatterns = ['pattern-stripe', 'pattern-crosshatch', 'pattern-dot'] as const

export type SvgPattern = (typeof svgPatterns)[number]

const color1 = colorMix({ color1: 'var(--color-base-300)', color2: 'var(--color-base-100)', ratio: 25 })
const color2 = colorMix({ color1: 'var(--color-base-content)', color2: 'var(--color-base-100)', ratio: 25 })

export const SvgPatternDefs = () => (
	<defs>
		<pattern
			id={'pattern-stripe' satisfies SvgPattern}
			patternUnits='userSpaceOnUse'
			width='8'
			height='8'
			patternTransform='rotate(45)'
		>
			<rect width='8' height='8' fill={`var(--pattern-color1, ${color1})`} />
			<rect width='4' height='8' fill={`var(--pattern-color2, ${color2})`} />
		</pattern>
		<pattern id={'pattern-crosshatch' satisfies SvgPattern} patternUnits='userSpaceOnUse' width='8' height='8'>
			<path d='M0 0L8 8M8 0L0 8' stroke={`var(--pattern-color2, ${color2})`} strokeWidth='1.5' />
		</pattern>
		<pattern id={'pattern-dot' satisfies SvgPattern} patternUnits='userSpaceOnUse' width='8' height='8'>
			<rect width='8' height='8' fill={`var(--pattern-color1, ${color1})`} />
			<circle cx='4' cy='4' r='1.5' fill={`var(--pattern-color2, ${color2})`} />
		</pattern>
	</defs>
)
