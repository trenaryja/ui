import type { GeoRegionState } from './GeoMap.types'

export type GeoMapTooltipProps = {
	state: GeoRegionState
	color?: string
	label?: string
	formatValue?: (value: number) => string
}

const defaultFormat = (v: number) => v.toLocaleString()

export const GeoMapTooltip = ({ state, color, label, formatValue = defaultFormat }: GeoMapTooltipProps) => (
	<div className='dark-glass grid gap-1 rounded border border-current/25 p-2 text-sm shadow'>
		<div className='font-medium'>{state.location.name}</div>
		{state.value != null && (
			<div className='flex w-full gap-1 items-center'>
				{color && (
					<div
						className='size-4 shrink-0 rounded-xs border border-px border-current/25'
						style={{ backgroundColor: color }}
					/>
				)}
				<div className='flex justify-between w-full gap-2 items-baseline'>
					<span className='text-base-content/50'>{label ?? 'Value'}</span>
					<span className='font-mono font-bold tabular-nums'>{formatValue(state.value)}</span>
				</div>
			</div>
		)}
	</div>
)
