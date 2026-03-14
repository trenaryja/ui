'use client'

import { useUncontrolled } from '@mantine/hooks'
import type { SvgGeoMapLocation } from '@/data/svg-geo-maps'
import { cn, cnFn, EMPTY_OBJ } from '@/utils'
import type { GeoMapBaseProps, GeoRegionState } from '../GeoMap.types'
import { GeoMapDefault } from './GeoMapDefault'

export type GeoMapMultiSelectProps = GeoMapBaseProps & {
	variant: 'multi-select'
	value?: SvgGeoMapLocation['id'][]
	defaultValue?: SvgGeoMapLocation['id'][]
	onChange?: (value: SvgGeoMapLocation['id'][]) => void
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
	const [selectedIds, setSelectedIds] = useUncontrolled<SvgGeoMapLocation['id'][]>({
		value,
		defaultValue,
		finalValue: [],
		onChange,
	})

	const toggle = (id: SvgGeoMapLocation['id']) =>
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
				onRegionClick={(location, index) => {
					toggle(location.id)
					onRegionClick?.(location, index)
				}}
			/>
			{name && selectedIds.map((id) => <input key={id} type='hidden' name={name} value={id} />)}
		</>
	)
}
