'use client'

import { useUncontrolled } from '@mantine/hooks'
import { cn, cnFn, EMPTY_OBJ } from '@/utils'
import type { GeoMapBaseProps, GeoRegionState } from '../GeoMap.types'
import { GeoMapDefault } from './GeoMapDefault'

export type GeoMapSingleSelectProps = GeoMapBaseProps & {
	variant: 'single-select'
	value?: string | null
	defaultValue?: string | null
	onChange?: (value: string | null) => void
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
	const [selectedId, setSelectedId] = useUncontrolled<string | null>({
		value,
		defaultValue,
		finalValue: null,
		onChange,
	})

	const toggle = (id: string) => setSelectedId(selectedId === id ? null : id)

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
				onRegionClick={(feature, index) => {
					toggle(feature.id)
					onRegionClick?.(feature, index)
				}}
			/>
			{name && selectedId && <input type='hidden' name={name} value={selectedId} />}
		</>
	)
}
