import type { Arrow, Placement } from '@/utils'
import { cn } from '@/utils'

const verticalPlacements: [Placement, Arrow][] = [
	['top-start', '↖'],
	['top-center', '↑'],
	['top-end', '↗'],
	['bottom-start', '↙'],
	['bottom-center', '↓'],
	['bottom-end', '↘'],
]

const horizontalPlacements: [Placement, Arrow][] = [
	['left-start', '↖'],
	['right-start', '↗'],
	['left-center', '←'],
	['right-center', '→'],
	['left-end', '↙'],
	['right-end', '↘'],
]

export type PlacementPickerProps = {
	value: Placement | undefined
	onChange: (p: Placement | undefined) => void
	force?: boolean
	className?: string
	selectedClassName?: string
}

export const PlacementPicker = ({ value, onChange, force, className, selectedClassName }: PlacementPickerProps) => {
	const btn = (p: Placement, arrow: Arrow) => (
		<button
			type='button'
			key={p}
			className={cn('btn btn-circle btn-sm', p === value ? cn('btn-primary', selectedClassName) : 'btn-ghost')}
			onClick={() => onChange(p)}
			title={p}
		>
			{arrow}
		</button>
	)

	return (
		<div className={cn('grid grid-cols-5 grid-rows-5 place-items-center gap-1', className)}>
			<div />
			{verticalPlacements.slice(0, 3).map(([placement, arrow]) => btn(placement, arrow))}
			<div />

			{btn(...horizontalPlacements[0])}
			<div className='col-span-3 row-span-3'>
				{!force && (
					<button
						type='button'
						className={cn(
							'btn btn-circle btn-sm',
							value === undefined ? cn('btn-primary', selectedClassName) : 'btn-ghost opacity-30',
						)}
						onClick={() => onChange(undefined)}
						title='None'
					>
						N/A
					</button>
				)}
			</div>
			{btn(...horizontalPlacements[1])}

			{btn(...horizontalPlacements[2])}
			<div className='col-start-5'>{btn(...horizontalPlacements[3])}</div>

			{btn(...horizontalPlacements[4])}
			<div className='col-start-5'>{btn(...horizontalPlacements[5])}</div>

			<div />
			{verticalPlacements.slice(3, 6).map(([placement, arrow]) => btn(placement, arrow))}
			<div />
		</div>
	)
}

// TODO: narrow type to exclude undefined when force=true
// TODO: add unselected className
// TODO: separate customizable className per Placement option? This allows disabling (maybe take a map in with buttonProps?)
// TODO: useHiddenInput and useUncontrolled to make a proper form control
