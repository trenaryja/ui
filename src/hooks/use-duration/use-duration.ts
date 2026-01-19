import type { Duration, DurationUnit } from '@/utils'
import { getDuration } from '@/utils'
import { useEffect, useRef, useState } from 'react'

export type UseDurationOptions<T extends readonly DurationUnit[]> = {
	/** Diff computed as targetDate - now */
	readonly targetDate: Date
	readonly units: T
	readonly intervalMs?: number
	readonly enabled?: boolean
}

export const useDuration = <T extends readonly DurationUnit[]>(options: UseDurationOptions<T>): Duration<T> => {
	const { targetDate, units, intervalMs = 100, enabled = true } = options

	const targetRef = useRef(targetDate)
	const unitsRef = useRef(units)

	const [duration, setDuration] = useState<Duration<T>>(() =>
		getDuration({ start: new Date(0), end: new Date(0), units }),
	)

	useEffect(() => {
		targetRef.current = targetDate
		unitsRef.current = units
	}, [targetDate, units])

	useEffect(() => {
		if (!enabled) return

		const tick = () => {
			setDuration(
				getDuration({
					start: new Date(),
					end: targetRef.current,
					units: unitsRef.current,
				}),
			)
		}

		tick()
		const id = setInterval(tick, intervalMs)
		return () => clearInterval(id)
	}, [enabled, intervalMs])

	return duration
}
