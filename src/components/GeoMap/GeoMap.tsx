import { GeoMapMultiSelect, GeoMapSingleSelect, GeoMapDefault } from './variants'
import type { GeoMapMultiSelectProps, GeoMapSingleSelectProps, GeoMapDefaultProps } from './variants'

export type GeoMapProps = GeoMapMultiSelectProps | GeoMapSingleSelectProps | GeoMapDefaultProps

export const GeoMap = ({ variant, ...rest }: GeoMapProps) => {
	if (variant === 'multi-select')
		return <GeoMapMultiSelect variant={variant} {...(rest as Omit<GeoMapMultiSelectProps, 'variant'>)} />
	if (variant === 'single-select')
		return <GeoMapSingleSelect variant={variant} {...(rest as Omit<GeoMapSingleSelectProps, 'variant'>)} />
	return <GeoMapDefault {...rest} />
}
