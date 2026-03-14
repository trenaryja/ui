import type { Duration, DurationUnit } from '@/utils'
import { getDuration } from '@/utils'
import { useEffect, useState } from 'react'

export type UseDurationOptions<TUnits extends readonly DurationUnit[]> = {
	readonly targetDate: Date
	readonly units: TUnits
	readonly intervalMs?: number
	readonly enabled?: boolean
}

export const useDuration = <TUnits extends readonly DurationUnit[]>(options: UseDurationOptions<TUnits>): Duration<TUnits> => {
	const { targetDate, units, intervalMs = 100, enabled = true } = options

	const [duration, setDuration] = useState<Duration<TUnits>>(() =>
		getDuration({ start: new Date(0), end: new Date(0), units }),
	)

	useEffect(() => {
		if (!enabled) return

		const tick = () => {
			setDuration(getDuration({ start: new Date(), end: targetDate, units }))
		}

		tick()
		const id = setInterval(tick, intervalMs)
		return () => clearInterval(id)
	}, [enabled, intervalMs, targetDate, units])

	return duration
}
