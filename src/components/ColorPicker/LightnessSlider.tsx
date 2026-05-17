'use client'

import { buildOklch, cn, css, formatPercent } from '@/utils'
import { Field } from '../Field/Field'
import { Range } from '../Range/Range'

export type LightnessSliderProps = {
	value: number
	onChange: (v: number) => void
	className?: string
}

export const LightnessSlider = ({ value, onChange, className }: LightnessSliderProps) => (
	<Field
		label='L'
		labelPlacement='left-center'
		hint={formatPercent(value, { decimals: 0 })}
		hintPlacement='right-center'
		className={cn('font-mono', className)}
	>
		<Range
			min={0}
			max={1}
			step={0.01}
			value={value}
			className='range-gradient range-black-white range-no-ring'
			style={css({ '--range-thumb': buildOklch(value, 0, 0) })}
			onChange={(e) => onChange(e.target.valueAsNumber)}
		/>
	</Field>
)
