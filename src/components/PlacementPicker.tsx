import { cn } from '@/utils'
import type { DirectionPlacement, FlexPlacement, Placement } from './Field'

const V: [DirectionPlacement, FlexPlacement, string][] = [
	['top', 'start', '↖'],
	['top', 'center', '↑'],
	['top', 'end', '↗'],
	['bottom', 'start', '↙'],
	['bottom', 'center', '↓'],
	['bottom', 'end', '↘'],
]

const H: [DirectionPlacement, FlexPlacement, string][] = [
	['left', 'start', '↖'],
	['right', 'start', '↗'],
	['left', 'center', '←'],
	['right', 'center', '→'],
	['left', 'end', '↙'],
	['right', 'end', '↘'],
]

export type PlacementPickerProps = {
	value: Placement | undefined
	onChange: (p: Placement | undefined) => void
	force?: boolean
	className?: string
	selectedClassName?: string
}

export const PlacementPicker = ({ value, onChange, force, className, selectedClassName }: PlacementPickerProps) => {
	const btn = (dir: DirectionPlacement, flex: FlexPlacement, icon: string) => {
		const p = `${dir}-${flex}` satisfies Placement
		return (
			<button
				type='button'
				key={p}
				className={cn('btn btn-circle btn-sm', p === value ? cn('btn-primary', selectedClassName) : 'btn-ghost')}
				onClick={() => onChange(p)}
				title={p}
			>
				{icon}
			</button>
		)
	}

	return (
		<div className={cn('grid grid-cols-5 grid-rows-5 place-items-center gap-1', className)}>
			<div />
			{V.slice(0, 3).map(([d, f, i]) => btn(d, f, i))}
			<div />

			{btn(...H[0])}
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
			{btn(...H[1])}

			{btn(...H[2])}
			<div className='col-start-5'>{btn(...H[3])}</div>

			{btn(...H[4])}
			<div className='col-start-5'>{btn(...H[5])}</div>

			<div />
			{V.slice(3, 6).map(([d, f, i]) => btn(d, f, i))}
			<div />
		</div>
	)
}

// TODO: narrow type to exclude undefined when force=true
// TODO: add unselected className
// TODO: separate customizable className per Placement option? This allows disabling (maybe take a map in with buttonProps?)
// TODO: useHiddenInput and useUncontrolled to make a proper form control
