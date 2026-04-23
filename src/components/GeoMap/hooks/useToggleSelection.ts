'use client'

import { useUncontrolled } from '@mantine/hooks'
import type { FormInputConfig } from '../GeoMap.types'

const toArr = (v: string | readonly string[] | null | undefined): string[] | undefined => {
	if (v === undefined) return undefined
	if (v === null) return []
	if (typeof v === 'string') return v ? [v] : []
	return [...v]
}

export const useToggleSelection = (config: FormInputConfig | undefined) => {
	const isMulti = config?.mode === 'multi'
	const [selectedIds, setSelectedIds] = useUncontrolled<string[]>({
		value: toArr(config?.value),
		defaultValue: toArr(config?.defaultValue),
		finalValue: [],
		onChange: (next) => {
			if (!config) return
			if (config.mode === 'multi') config.onChange?.(next)
			else config.onChange?.(next[0] ?? null)
		},
	})

	const toggle = (id: string) => {
		if (!config) return
		if (isMulti) setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id])
		else setSelectedIds(selectedIds[0] === id ? [] : [id])
	}

	return [selectedIds, toggle] as const
}
