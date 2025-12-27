import { useTimeout } from '@mantine/hooks'
import { useState } from 'react'

type UseCycleOptions = {
	/**
	 * Starting index (normalized by `wrap`).
	 *
	 * Defaults to 0.
	 */
	initialIndex?: number

	/**
	 * When true, increment/decrement wrap around (mod length).
	 * When false, index is clamped to [0, length - 1].
	 *
	 * Defaults to true.
	 */
	wrap?: boolean

	/**
	 * Resets back to index 0 after this many ms since the last interaction
	 * (increment/decrement/setIndex).
	 *
	 * Set to `null`/`undefined` to disable.
	 */
	idleResetMs?: number | null
}

type UseCycleResult<V> = {
	index: number
	value: V
	next: V
	prev: V
	increment: () => void
	decrement: () => void
	setIndex: (index: number) => void
	reset: () => void
}

/**
 * Cycles through a list of values (wrap or clamp), with optional idle reset.
 *
 * - Optional `idleResetMs` resets back to index 0 after inactivity.
 * - `prev` is derived from the current index (after `increment()`, `prev` becomes
 *   the value you just had).
 */
export const useCycle = <const T extends readonly unknown[]>(
	values: T,
	options: UseCycleOptions = {},
): UseCycleResult<T[number]> => {
	const { idleResetMs = null, initialIndex = 0, wrap = true } = options

	const { length } = values
	const disabled = length <= 0

	const norm = (n: number) => {
		if (disabled) return 0
		if (wrap) return (n + length) % length
		return Math.max(0, Math.min(length - 1, n))
	}

	const resetEnabled = idleResetMs != null && idleResetMs > 0 && !disabled
	const [index, setIndexState] = useState(() => norm(initialIndex))
	const { start, clear } = useTimeout(() => setIndexState(0), resetEnabled ? idleResetMs : 0)

	const bump = () => {
		if (!resetEnabled) return
		clear()
		start()
	}

	const setIndex = (i: number) => {
		setIndexState(norm(i))
		bump()
	}

	const reset = () => {
		setIndexState(0)
		if (resetEnabled) clear()
	}

	const increment = () => setIndex(index + 1)
	const decrement = () => setIndex(index - 1)

	const idx = norm(index)
	const value = values[idx]
	const next = values[norm(idx + 1)]
	const prev = values[norm(idx - 1)]

	return { index, value, next, prev, increment, decrement, setIndex, reset }
}
