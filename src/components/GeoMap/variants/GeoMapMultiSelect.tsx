'use client'

import { useUncontrolled } from '@mantine/hooks'
import type { SvgGeoMapLocation } from '@/data/svg-geo-maps'
import type { GeoMapBaseProps } from '../GeoMap.types'
import { GeoMapStatic } from './GeoMapStatic'

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
			<GeoMapStatic
				{...rest}
				variant='static'
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
