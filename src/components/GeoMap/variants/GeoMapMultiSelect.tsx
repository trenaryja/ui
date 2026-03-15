'use client'

import { useUncontrolled } from '@mantine/hooks'
import { cn, cnFn, EMPTY_OBJ } from '@/utils'
import type { GeoMapBaseProps, GeoRegionState } from '../GeoMap.types'
import { GeoMapDefault } from './GeoMapDefault'

export type GeoMapMultiSelectProps = GeoMapBaseProps & {
	variant: 'multi-select'
	value?: string[]
	defaultValue?: string[]
	onChange?: (value: string[]) => void
	name?: string
}

export const GeoMapMultiSelect = ({
	value,
	defaultValue,
	onChange,
	name,
	classNames = EMPTY_OBJ,
	onRegionClick,
	...rest
}: GeoMapMultiSelectProps) => {
	const [selectedIds, setSelectedIds] = useUncontrolled<string[]>({
		value,
		defaultValue,
		finalValue: [],
		onChange,
	})

	const toggle = (id: string) =>
		setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id])

	return (
		<>
			<GeoMapDefault
				{...rest}
				variant='default'
				classNames={{
					...classNames,
					region: (state: GeoRegionState) => cn('cursor-pointer', cnFn(classNames.region, state)),
				}}
				selectedIds={selectedIds}
				onRegionClick={(feature, index) => {
					toggle(feature.id)
					onRegionClick?.(feature, index)
				}}
			/>
			{name && selectedIds.map((id) => <input key={id} type='hidden' name={name} value={id} />)}
		</>
	)
}
