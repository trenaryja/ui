import { cn } from '@/utils'
import type { CSSProperties } from 'react'

export const picsum = async (size = 500) => await fetch(`https://picsum.photos/${size}`).then((res) => res.url)

export type CountdownProps = { value: number; digits?: number; transitionMs?: number; className?: string }

export const Countdown = ({ value, digits = 1, transitionMs = 1000, className }: CountdownProps) => {
	const absValue = Math.abs(value)
	const totalDigitsNeeded = Math.max(String(absValue).length, digits)
	const partsNeeded = Math.ceil(totalDigitsNeeded / 3)
	const leftmostPadding = totalDigitsNeeded - 3 * (partsNeeded - 1)

	const parts = [...Array(partsNeeded).keys()].reverse().map((partIndex, i) => ({
		value: Math.floor((absValue / 1000 ** partIndex) % 1000),
		place: 1000 ** partIndex,
		digits: ((v) => (v > 1 ? Math.min(v, 3) : undefined))(partsNeeded === 1 ? digits : i === 0 ? leftmostPadding : 3),
	}))

	return (
		<span
			className={cn(
				'countdown justify-center',
				'*:[&::before]:duration-(--transition-duration)',
				'*:[&::after]:duration-(--transition-duration)',
				className,
			)}
		>
			{parts.map((part) => (
				<span
					key={part.place}
					style={
						{
							'--value': part.value,
							'--transition-duration': `${transitionMs}ms`,
							...(part.digits !== undefined && { '--digits': part.digits }),
						} as CSSProperties
					}
				>
					{part.value}
				</span>
			))}
		</span>
	)
}

export type CountdownBoxProps = CountdownProps & { label: string }
export const CountdownBox = ({ label, className, ...props }: CountdownBoxProps) => (
	<div className={cn('flex flex-col p-2 bg-base-300 rounded-box', className)}>
		<Countdown className='text-5xl' {...props} />
		<span className='text-center'>{label}</span>
	</div>
)
