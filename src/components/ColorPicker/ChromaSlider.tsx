'use client'

import { buildOklch, cn, css } from '@/utils'
import { Field } from '../Field/Field'
import { Range } from '../Range/Range'

export type ChromaSliderProps = {
	chroma: number
	chromaMax: number
	onRatioChange: (ratio: number) => void
	lightness: number
	hue: number
	className?: string
}

export const ChromaSlider = ({ chroma, chromaMax, onRatioChange, lightness, hue, className }: ChromaSliderProps) => (
	<Field
		label='C'
		labelPlacement='left-center'
		hint={chroma.toFixed(3)}
		hintPlacement='right-center'
		className={cn('font-mono', className)}
	>
		<Range
			min={0}
			max={1}
			step={0.001}
			value={chromaMax > 0 ? chroma / chromaMax : 0}
			className='range-gradient range-no-ring'
			style={css({
				'--range-gradient': `linear-gradient(to right, ${buildOklch(lightness, 0, hue)}, ${buildOklch(lightness, chromaMax, hue)})`,
				'--range-thumb': buildOklch(lightness, chroma, hue),
			})}
			onChange={(e) => onRatioChange(e.target.valueAsNumber)}
		/>
	</Field>
)
