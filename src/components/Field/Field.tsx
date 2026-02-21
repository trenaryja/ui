import type { ClassNames } from '@/types'
import type { Placement } from '@/utils'
import { cn } from '@/utils'
import type { ReactNode } from 'react'
import type { FieldsetProps } from '../Fieldset/Fieldset'
import { Fieldset } from '../Fieldset/Fieldset'
import type { FieldSlot } from './Field.utils'
import { buildGrid, fieldSlots, getGridAlignment, getItemsAlign, placementToArea, slotBaseClasses } from './Field.utils'

export const fieldClassNames = ['control', 'error', 'group', 'hint', 'label']

export type FieldClassNames = (typeof fieldClassNames)[number]

export type FieldProps = ClassNames<FieldClassNames> &
	FieldsetProps & {
		label?: ReactNode
		labelPlacement?: Placement
		hint?: ReactNode
		hintPlacement?: Placement
		error?: ReactNode
		errorPlacement?: Placement
		slotOrder?: readonly [FieldSlot, FieldSlot, FieldSlot]
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
	...rest
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
		void (groups.get(data.placement)?.push(slot) ?? groups.set(data.placement, [slot]))
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
		<Fieldset className={cn(className)} style={style} {...rest}>
			{[...groups.entries()].map(([placement, slots]) => renderGroup(placement, slots))}
			<div className={cn(classNames?.control)} style={{ gridArea: 'ctrl' }}>
				{children}
			</div>
		</Fieldset>
	)
}

// TODO: add name/htmlFor abilities, including wrapLabel
