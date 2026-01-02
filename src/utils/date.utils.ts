import {
	addDays,
	addHours,
	addMilliseconds,
	addMinutes,
	addMonths,
	addSeconds,
	addWeeks,
	addYears,
	differenceInDays,
	differenceInHours,
	differenceInMilliseconds,
	differenceInMinutes,
	differenceInMonths,
	differenceInSeconds,
	differenceInWeeks,
	differenceInYears,
} from 'date-fns'
import { pick, sortBy, unique } from 'remeda'

export const durationUnits = [
	'years',
	'months',
	'weeks',
	'days',
	'hours',
	'minutes',
	'seconds',
	'milliseconds',
] as const
export type DurationUnit = (typeof durationUnits)[number]

export type Duration<T extends readonly DurationUnit[]> = Record<T[number], number> & {
	readonly _ms: number
}

export const durationUnitMap = {
	years: { diff: differenceInYears, add: addYears },
	months: { diff: differenceInMonths, add: addMonths },
	weeks: { diff: differenceInWeeks, add: addWeeks },
	days: { diff: differenceInDays, add: addDays },
	hours: { diff: differenceInHours, add: addHours },
	minutes: { diff: differenceInMinutes, add: addMinutes },
	seconds: { diff: differenceInSeconds, add: addSeconds },
	milliseconds: { diff: differenceInMilliseconds, add: addMilliseconds },
} as const

export const getDuration = <T extends readonly DurationUnit[]>(opts: {
	readonly start: Date
	readonly end: Date
	readonly units: T
}): Duration<T> => {
	const { start, end, units } = opts
	const totalMsRaw = end.getTime() - start.getTime()
	const forward = totalMsRaw >= 0
	const [from, to] = forward ? [start, end] : [end, start]

	const out: Record<DurationUnit, number> = {
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	}

	let cursor = from

	for (const unit of sortBy(unique(units), (x) => durationUnits.indexOf(x))) {
		const { diff, add } = durationUnitMap[unit]
		out[unit] = diff(to, cursor)
		cursor = add(cursor, out[unit])
	}

	return {
		...(pick(out, units) as Record<T[number], number>),
		_ms: forward ? totalMsRaw : -totalMsRaw,
	}
}

export const toDateTimeLocal = (d: Date) =>
	new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 19)

export const randomDate = (
	start: number | Date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
	end: number | Date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
): Date => {
	const startDate = new Date(start).getTime()
	const endDate = new Date(end).getTime()
	return new Date(startDate + Math.random() * (endDate - startDate))
}
