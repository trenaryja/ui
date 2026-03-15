import { GeoMapDefault, GeoMapMultiSelect, GeoMapSingleSelect } from './variants'
import type { GeoMapDefaultProps, GeoMapMultiSelectProps, GeoMapSingleSelectProps } from './variants'

export type GeoMapProps = GeoMapDefaultProps | GeoMapMultiSelectProps | GeoMapSingleSelectProps

export const GeoMap = ({ variant, ...rest }: GeoMapProps) => {
	if (variant === 'multi-select')
		return <GeoMapMultiSelect variant={variant} {...(rest as Omit<GeoMapMultiSelectProps, 'variant'>)} />
	if (variant === 'single-select')
		return <GeoMapSingleSelect variant={variant} {...(rest as Omit<GeoMapSingleSelectProps, 'variant'>)} />
	return <GeoMapDefault {...rest} />
}
