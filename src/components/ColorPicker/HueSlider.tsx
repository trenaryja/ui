'use client'

import { cn, css } from '@/utils'
import { Field } from '../Field/Field'
import { Range } from '../Range/Range'

export type HueSliderProps = {
	value: number
	onChange: (v: number) => void
	className?: string
}

export const HueSlider = ({ value, onChange, className }: HueSliderProps) => (
	<Field
		label='H'
		labelPlacement='left-center'
		hint={String(Math.round(value))}
		hintPlacement='right-center'
		className={cn('font-mono', className)}
	>
		<Range
			min={0}
			max={360}
			step={1}
			value={value}
			className='range-gradient range-rainbow range-no-ring'
			style={css({ '--range-thumb': `hsl(${value} 100% 50%)` })}
			onChange={(e) => onChange(e.target.valueAsNumber)}
		/>
	</Field>
)
