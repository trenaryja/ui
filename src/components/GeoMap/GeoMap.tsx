'use client'

import { cn, EMPTY_OBJ } from '@/utils'
import { useUncontrolled } from '@mantine/hooks'
import { Suspense } from 'react'
import type { GeoMapViewProps } from './components/GeoMapView'
import { GeoMapView } from './components/GeoMapView'
import type { GeoMapBaseProps } from './GeoMap.types'

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

const toArray = (v: string | null | undefined) => (v === undefined ? undefined : v ? [v] : [])

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
		value: isMulti ? value : toArray(value),
		defaultValue: isMulti ? defaultValue : toArray(defaultValue),
		finalValue: [],
		onChange: (next) => (isMulti ? onChange?.(next) : onChange?.(next[0] ?? null)),
	})

	const toggle = (id: string) => {
		if (isMulti) setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id])
		else setSelectedIds(selectedIds[0] === id ? [] : [id])
	}

	return (
		<>
			<GeoMapView
				{...rest}
				className={cn('[&_path]:cursor-pointer', className)}
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

export const GeoMap = ({ ...props }: GeoMapProps) => (
	<Suspense fallback={null}>
		{props.selection ? <GeoMapSelectable {...props} /> : <GeoMapView {...(props as GeoMapViewProps)} />}
	</Suspense>
)
