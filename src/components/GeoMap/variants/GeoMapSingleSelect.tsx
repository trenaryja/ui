'use client'

import { useUncontrolled } from '@mantine/hooks'
import type { SvgGeoMapLocation } from '@/data/svg-geo-maps'
import { cn, cnFn, EMPTY_OBJ } from '@/utils'
import type { GeoMapBaseProps, GeoRegionState } from '../GeoMap.types'
import { GeoMapDefault } from './GeoMapDefault'

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
	classNames = EMPTY_OBJ,
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
			<GeoMapDefault
				{...rest}
				variant='default'
				classNames={{
					...classNames,
					region: (state: GeoRegionState) => cn('cursor-pointer', cnFn(classNames.region, state)),
				}}
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
