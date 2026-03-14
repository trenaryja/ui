import { svgGeoMaps } from '.'

export const usStates = svgGeoMaps.usa.locations.map(({ name, id }) => ({ name, id }) as const)

export type UsStateId = (typeof usStates)[number]['id']
export type UsStateName = (typeof usStates)[number]['name']

export const lookupStateByName = (name: string | null | undefined) =>
	name ? (usStates.find((x) => x.name.toLowerCase() === name.trim().toLowerCase()) ?? null) : null
