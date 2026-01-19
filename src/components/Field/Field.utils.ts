import type { DirectionPlacement, FlexPlacement, Placement } from '@/utils'
import { flexPlacements } from '@/utils'
import type { CSSProperties } from 'react'

export const fieldSlots = ['label', 'hint', 'error'] as const
export type FieldSlot = (typeof fieldSlots)[number]

export const slotBaseClasses: Record<FieldSlot, string> = {
	label: '',
	hint: 'text-base-content/50',
	error: 'text-error',
}

export const placementToArea = (p: Placement) => p.replace('-', '_')

export const buildGrid = (placements: Placement[]) => {
	if (placements.length === 0)
		return {
			gridTemplateAreas: '"ctrl"',
			gridTemplateColumns: 'minmax(0,1fr)',
			gridTemplateRows: 'auto',
		} satisfies CSSProperties

	const hasTop = placements.some((p) => p.startsWith('top'))
	const hasBottom = placements.some((p) => p.startsWith('bottom'))
	const hasLeft = placements.some((p) => p.startsWith('left'))
	const hasRight = placements.some((p) => p.startsWith('right'))

	const hSet = new Set(
		placements.filter((p) => p.startsWith('top') || p.startsWith('bottom')).map((p) => p.split('-')[1]),
	)
	const hSubs = flexPlacements.filter((f) => hSet.has(f))
	if (hSubs.length === 0) hSubs.push('center')

	const vSet = new Set(
		placements.filter((p) => p.startsWith('left') || p.startsWith('right')).map((p) => p.split('-')[1]),
	)
	const vSubs = flexPlacements.filter((f) => vSet.has(f))
	if (vSubs.length === 0) vSubs.push('center')

	const placementSet = new Set(placements)
	const getArea = (p: Placement): string => (placementSet.has(p) ? placementToArea(p) : '.')

	const rows: string[][] = []

	if (hasTop) {
		const row: string[] = []
		if (hasLeft) row.push('.')
		hSubs.forEach((h) => row.push(getArea(`top-${h}` as Placement)))
		if (hasRight) row.push('.')
		rows.push(row)
	}

	vSubs.forEach((v) => {
		const row: string[] = []
		if (hasLeft) row.push(getArea(`left-${v}` as Placement))
		hSubs.forEach(() => row.push('ctrl'))
		if (hasRight) row.push(getArea(`right-${v}` as Placement))
		rows.push(row)
	})

	if (hasBottom) {
		const row: string[] = []
		if (hasLeft) row.push('.')
		hSubs.forEach((h) => row.push(getArea(`bottom-${h}` as Placement)))
		if (hasRight) row.push('.')
		rows.push(row)
	}

	const colSizes: string[] = []
	if (hasLeft) colSizes.push('auto')
	hSubs.forEach(() => colSizes.push('minmax(0,1fr)'))
	if (hasRight) colSizes.push('auto')

	const rowSizes: string[] = []
	if (hasTop) rowSizes.push('auto')
	vSubs.forEach(() => rowSizes.push('auto'))
	if (hasBottom) rowSizes.push('auto')

	return {
		gridTemplateAreas: rows.map((r) => `"${r.join(' ')}"`).join(' '),
		gridTemplateColumns: colSizes.join(' '),
		gridTemplateRows: rowSizes.join(' '),
	} satisfies CSSProperties
}

const gridAlignMap = {
	start: { self: 'self-start', justify: 'justify-self-start' },
	center: { self: 'self-center', justify: 'justify-self-center' },
	end: { self: 'self-end', justify: 'justify-self-end' },
} satisfies Record<FlexPlacement, { self: string; justify: string }>

export const getGridAlignment = (p: Placement) => {
	const [dir, flex] = p.split('-') as [DirectionPlacement, FlexPlacement]
	const { self, justify } = gridAlignMap[flex]
	return dir === 'top' || dir === 'bottom'
		? `${gridAlignMap[dir === 'top' ? 'end' : 'start'].self} ${justify}`
		: `${self} ${gridAlignMap[dir === 'left' ? 'end' : 'start'].justify}`
}

export const getItemsAlign = (p: Placement) => {
	const [dir, flex] = p.split('-') as [DirectionPlacement, FlexPlacement]
	if (dir === 'top' || dir === 'bottom') return `items-${flex}`
	return dir === 'left' ? 'items-end' : 'items-start'
}
