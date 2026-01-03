import type { DirectionPlacement, FlexPlacement, Placement } from '@/utils'
import { cn, flexPlacements } from '@/utils'
import type { CSSProperties, ReactNode } from 'react'
import type { FieldsetProps } from './Fieldset'
import { Fieldset } from './Fieldset'

export const fieldSlots = ['label', 'hint', 'error'] as const
type FieldSlot = (typeof fieldSlots)[number]

const placementToArea = (p: Placement) => p.replace('-', '_')

const buildGrid = (placements: Placement[]) => {
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

const getGridAlignment = (p: Placement) => {
	const [dir, flex] = p.split('-') as [DirectionPlacement, FlexPlacement]
	const { self, justify } = gridAlignMap[flex]
	return dir === 'top' || dir === 'bottom'
		? `${gridAlignMap[dir === 'top' ? 'end' : 'start'].self} ${justify}`
		: `${self} ${gridAlignMap[dir === 'left' ? 'end' : 'start'].justify}`
}

const getItemsAlign = (p: Placement) => {
	const [dir, flex] = p.split('-') as [DirectionPlacement, FlexPlacement]
	if (dir === 'top' || dir === 'bottom') return `items-${flex}`
	return dir === 'left' ? 'items-end' : 'items-start'
}

const slotBaseClasses: Record<FieldSlot, string> = {
	label: '',
	hint: 'text-base-content/50',
	error: 'text-error',
}

export type FieldProps = FieldsetProps & {
	label?: ReactNode
	labelPlacement?: Placement
	hint?: ReactNode
	hintPlacement?: Placement
	error?: ReactNode
	errorPlacement?: Placement
	slotOrder?: readonly [FieldSlot, FieldSlot, FieldSlot]
	classNames?: {
		label?: string
		control?: string
		hint?: string
		error?: string
		group?: string
	}
}

export const Field = ({
	label,
	labelPlacement = 'top-start',
	hint,
	hintPlacement = 'bottom-start',
	error,
	errorPlacement = 'bottom-end',
	slotOrder = fieldSlots,
	className,
	classNames,
	children,
}: FieldProps) => {
	const slotData = {
		label: label ? { content: label, placement: labelPlacement } : null,
		hint: hint ? { content: hint, placement: hintPlacement } : null,
		error: error ? { content: error, placement: errorPlacement } : null,
	}

	const groups = new Map<Placement, FieldSlot[]>()

	for (const slot of slotOrder) {
		const data = slotData[slot]
		if (!data) continue
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		groups.get(data.placement)?.push(slot) ?? groups.set(data.placement, [slot])
	}

	const style = buildGrid([...groups.keys()])

	const renderSlotContent = (slot: FieldSlot) => {
		const data = slotData[slot]!
		const Tag = slot === 'label' ? 'label' : 'span'
		return <Tag className={cn(slotBaseClasses[slot], classNames?.[slot])}>{data.content}</Tag>
	}

	const renderGroup = (placement: Placement, slots: FieldSlot[]) => {
		const area = placementToArea(placement)
		const gridAlign = getGridAlignment(placement)

		if (slots.length === 1) {
			const slot = slots[0]
			const data = slotData[slot]!
			const Tag = slot === 'label' ? 'label' : 'span'
			return (
				<Tag key={area} className={cn(slotBaseClasses[slot], gridAlign, classNames?.[slot])} style={{ gridArea: area }}>
					{data.content}
				</Tag>
			)
		}

		return (
			<div
				key={area}
				className={cn('flex flex-col', gridAlign, getItemsAlign(placement), classNames?.group)}
				style={{ gridArea: area }}
			>
				{slots.map(renderSlotContent)}
			</div>
		)
	}

	return (
		<Fieldset className={cn(className)} style={style}>
			{[...groups.entries()].map(([placement, slots]) => renderGroup(placement, slots))}
			<div className={cn(classNames?.control)} style={{ gridArea: 'ctrl' }}>
				{children}
			</div>
		</Fieldset>
	)
}

// TODO: add name/htmlFor abilities, including wrapLabel
