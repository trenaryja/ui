import { cn } from '@/utils'

export type TimeoutBarProps = {
	active: boolean
	className?: string
	duration?: number
	/** Key to reset the animation (e.g., increment on each trigger) */
	resetKey?: number | string
}

export const TimeoutBar = ({ active, className, duration = 2000, resetKey }: TimeoutBarProps) => {
	if (!active) return null
	return <span key={resetKey} className={cn('timeout-bar', className)} style={{ animationDuration: `${duration}ms` }} />
}
