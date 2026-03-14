import { usa } from './usa.svg-map'
import { world } from './world.svg-map'

export const svgGeoMaps = { usa, world } as const

export type SvgGeoMapName = keyof typeof svgGeoMaps

export type SvgGeoMap = (typeof svgGeoMaps)[SvgGeoMapName]

export type SvgGeoMapLocation = (typeof svgGeoMaps)[keyof typeof svgGeoMaps]['locations'][number]
