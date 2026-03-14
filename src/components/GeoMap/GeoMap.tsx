import {
	GeoMapMultiSelect,
	type GeoMapMultiSelectProps,
	GeoMapSingleSelect,
	type GeoMapSingleSelectProps,
	GeoMapStatic,
	type GeoMapStaticProps,
} from './variants'

export type GeoMapProps = GeoMapStaticProps | GeoMapMultiSelectProps | GeoMapSingleSelectProps

export const GeoMap = (props: GeoMapProps) => {
	if (props.variant === 'multi-select') return <GeoMapMultiSelect {...props} />
	if (props.variant === 'single-select') return <GeoMapSingleSelect {...props} />
	return <GeoMapStatic {...props} />
}
