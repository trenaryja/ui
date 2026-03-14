'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react'
import type { SvgGeoMapLocation } from '@/data/svg-geo-maps'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChoroplethConfig, GeoRegionState } from './GeoMap.types'
import { getChoroFillFn } from './GeoMap.utils'

export const useGeoMap = ({
	selectedIds,
	choropleth,
	hasTooltip,
}: {
	selectedIds: readonly SvgGeoMapLocation['id'][]
	choropleth?: ChoroplethConfig
	hasTooltip: boolean
}) => {
	const [hoveredId, setHoveredId] = useState<SvgGeoMapLocation['id']>()

	const getChoroFill = choropleth ? getChoroFillFn(choropleth) : () => undefined

	const pointRef = useRef({ x: 0, y: 0 })

	const { refs, floatingStyles, update } = useFloating({
		open: !!hoveredId && hasTooltip,
		placement: 'top',
		middleware: [offset(10), flip(), shift({ padding: 8 })],
	})

	useEffect(() => {
		const virtualEl = hasTooltip
			? {
					getBoundingClientRect: () => {
						const { x, y } = pointRef.current
						return { x, y, width: 0, height: 0, top: y, left: x, right: x, bottom: y }
					},
				}
			: null
		refs.setPositionReference(virtualEl)
	}, [hasTooltip, refs])

	const onRegionMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!hasTooltip) return
			pointRef.current = { x: e.clientX, y: e.clientY }
			update()
		},
		[hasTooltip, update],
	)

	const getRegionState = (location: SvgGeoMapLocation, index: number) =>
		({
			location,
			index,
			isSelected: selectedIds.includes(location.id),
			isHovered: hoveredId === location.id,
			value: choropleth?.data.find((d) => d.id === location.id)?.value,
		}) satisfies GeoRegionState

	return {
		hoveredId,
		setHoveredId,
		getRegionState,
		getChoroFill,
		floatingRef: refs.setFloating,
		floatingStyles,
		onRegionMouseMove,
	}
}
