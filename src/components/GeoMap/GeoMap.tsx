'use client'

import { cn, EMPTY_OBJ } from '@/utils'
import { Suspense } from 'react'
import { GeoMapView } from './components/GeoMapView'
import type { FormInputConfig, GeoMapBaseProps } from './GeoMap.types'
import { useToggleSelection } from './hooks/useToggleSelection'

export type GeoMapProps = GeoMapBaseProps

const HiddenInputs = ({ name, values }: { name?: string; values: readonly string[] }) =>
	name ? values.map((v) => <input key={v} type='hidden' name={name} value={v} />) : null

type SelectableProps = GeoMapBaseProps & {
	regionFormInput?: FormInputConfig
	pointFormInput?: FormInputConfig
}

const GeoMapSelectable = ({
	regionFormInput,
	pointFormInput,
	className,
	classNames = EMPTY_OBJ,
	onRegionClick,
	onPointClick,
	...rest
}: SelectableProps) => {
	const [selectedIds, toggleRegion] = useToggleSelection(regionFormInput)
	const [selectedPointIds, togglePoint] = useToggleSelection(pointFormInput)
	return (
		<>
			<GeoMapView
				{...rest}
				className={cn('[&_path]:cursor-pointer', className)}
				classNames={classNames}
				selectedIds={selectedIds}
				selectedPointIds={selectedPointIds}
				onRegionClick={(feature, index) => {
					if (regionFormInput) toggleRegion(feature.id)
					onRegionClick?.(feature, index)
				}}
				onPointClick={(point, index) => {
					if (pointFormInput) togglePoint(point.id)
					onPointClick?.(point, index)
				}}
			/>
			<HiddenInputs name={regionFormInput?.name} values={selectedIds} />
			<HiddenInputs name={pointFormInput?.name} values={selectedPointIds} />
		</>
	)
}

export const GeoMap = ({ regionFormInput, pointFormInput, ...props }: GeoMapProps) => (
	<Suspense fallback={null}>
		{regionFormInput || pointFormInput ? (
			<GeoMapSelectable {...props} regionFormInput={regionFormInput} pointFormInput={pointFormInput} />
		) : (
			<GeoMapView {...props} />
		)}
	</Suspense>
)
