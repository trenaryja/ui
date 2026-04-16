'use client'

import { cn, EMPTY_OBJ } from '@/utils'
import { useUncontrolled } from '@mantine/hooks'
import { Suspense } from 'react'
import type { GeoMapBaseProps } from './GeoMap.types'
import type { GeoMapViewProps } from './GeoMapView'
import { GeoMapView } from './GeoMapView'

type SingleSelection = {
	selection: 'single'
	value?: string | null
	defaultValue?: string | null
	onChange?: (value: string | null) => void
	name?: string
}

type MultiSelection = {
	selection: 'multi'
	value?: string[]
	defaultValue?: string[]
	onChange?: (value: string[]) => void
	name?: string
}

export type GeoMapProps =
	| (GeoMapBaseProps & { selection?: never })
	| (GeoMapBaseProps & MultiSelection)
	| (GeoMapBaseProps & SingleSelection)

const GeoMapSelectable = ({
	selection,
	value,
	defaultValue,
	onChange,
	name,
	className,
	classNames = EMPTY_OBJ,
	onRegionClick,
	...rest
}: GeoMapBaseProps & (MultiSelection | SingleSelection)) => {
	const isMulti = selection === 'multi'
	const [selectedIds, setSelectedIds] = useUncontrolled<string[]>({
		value: value === undefined ? undefined : isMulti ? value : value ? [value] : [],
		defaultValue: defaultValue === undefined ? undefined : isMulti ? defaultValue : defaultValue ? [defaultValue] : [],
		finalValue: [],
		onChange: (next) => {
			if (isMulti) onChange?.(next)
			else onChange?.(next[0] ?? null)
		},
	})

	const toggle = (id: string) => {
		if (isMulti) setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id])
		else setSelectedIds(selectedIds[0] === id ? [] : [id])
	}

	return (
		<>
			<GeoMapView
				{...rest}
				className={cn(className, '[&_path]:cursor-pointer')}
				classNames={classNames}
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

// Internal Suspense boundary handles the one-time lazy load of TopoJSON data
export const GeoMap = ({ ...props }: GeoMapProps) => (
	<Suspense fallback={null}>
		{props.selection ? <GeoMapSelectable {...props} /> : <GeoMapView {...(props as GeoMapViewProps)} />}
	</Suspense>
)
