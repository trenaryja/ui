import { Suspense } from 'react'
import { GeoMapDefault, GeoMapMultiSelect, GeoMapSingleSelect } from './variants'
import type { GeoMapDefaultProps, GeoMapMultiSelectProps, GeoMapSingleSelectProps } from './variants'

export type GeoMapProps = GeoMapDefaultProps | GeoMapMultiSelectProps | GeoMapSingleSelectProps

// Internal Suspense boundary handles the one-time lazy load of TopoJSON data for
// preset maps, so consumers don't need to wrap GeoMap themselves. After the preset
// is loaded, the cached promise resolves synchronously and suspension is a no-op.
export const GeoMap = ({ variant, ...rest }: GeoMapProps) => (
	<Suspense fallback={null}>
		{variant === 'multi-select' ? (
			<GeoMapMultiSelect variant={variant} {...(rest as Omit<GeoMapMultiSelectProps, 'variant'>)} />
		) : variant === 'single-select' ? (
			<GeoMapSingleSelect variant={variant} {...(rest as Omit<GeoMapSingleSelectProps, 'variant'>)} />
		) : (
			<GeoMapDefault {...rest} />
		)}
	</Suspense>
)
