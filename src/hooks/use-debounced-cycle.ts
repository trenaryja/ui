import { useTimeout } from '@mantine/hooks'
import { useState } from 'react'

type CycleValue<T extends number | unknown[]> = T extends number ? number : T extends (infer U)[] ? U : never

export function useDebouncedCycle<T extends number | string[]>(cycle: T, wait = 200) {
	const [index, setIndex] = useState(0)
	const { start, clear } = useTimeout(() => setIndex(0), wait)

	const length = typeof cycle === 'number' ? cycle : cycle.length
	const wrap = (n: number) => (n + length) % length
	const resolve = (i: number) => (typeof cycle === 'number' ? i : (cycle[i] as CycleValue<T>)) as CycleValue<T>
	const change = (amount: number) => {
		setIndex((prev) => wrap(prev + amount))
		clear()
		start()
	}

	const increment = () => change(1)
	const decrement = () => change(-1)
	const value = resolve(index)
	const next = resolve(wrap(index + 1))
	const prev = resolve(wrap(index - 1))

	return { index, value, increment, decrement, next, prev }
}
