'use client'

import { useUncontrolled } from '@mantine/hooks'
import type { SvgGeoMapLocation } from '@/data/svg-geo-maps'
import type { GeoMapBaseProps } from '../GeoMap.types'
import { GeoMapStatic } from './GeoMapStatic'

export type GeoMapSingleSelectProps = GeoMapBaseProps & {
	variant: 'single-select'
	value?: SvgGeoMapLocation['id'] | null
	defaultValue?: SvgGeoMapLocation['id'] | null
	onChange?: (value: SvgGeoMapLocation['id'] | null) => void
	name?: string
}

export const GeoMapSingleSelect = ({
	value,
	defaultValue,
	onChange,
	name,
	onRegionClick,
	...rest
}: GeoMapSingleSelectProps) => {
	const [selectedId, setSelectedId] = useUncontrolled<SvgGeoMapLocation['id'] | null>({
		value,
		defaultValue,
		finalValue: null,
		onChange,
	})

	const toggle = (id: SvgGeoMapLocation['id']) => setSelectedId(selectedId === id ? null : id)

	return (
		<>
			<GeoMapStatic
				{...rest}
				variant='static'
				selectedIds={selectedId ? [selectedId] : []}
				onRegionClick={(location, index) => {
					toggle(location.id)
					onRegionClick?.(location, index)
				}}
			/>
			{name && selectedId && <input type='hidden' name={name} value={selectedId} />}
		</>
	)
}
