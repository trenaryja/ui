'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChoroplethConfig, GeoFeature, GeoRegionState } from './GeoMap.types'
import { getChoroFillFn } from './GeoMap.utils'

export type TooltipData = {
	feature: GeoFeature
	index: number
	value?: number
} | null

export const useGeoMap = ({
	selectedIds,
	choropleth,
	hasTooltip,
}: {
	selectedIds: readonly string[]
	choropleth?: ChoroplethConfig
	hasTooltip: boolean
}) => {
	const getChoroFill = choropleth ? getChoroFillFn(choropleth) : () => undefined

	const [tooltipData, setTooltipData] = useState<TooltipData>(null)
	const pointRef = useRef({ x: 0, y: 0 })

	const { refs, floatingStyles, update } = useFloating({
		open: !!tooltipData && hasTooltip,
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

	const showTooltip = useCallback(
		(feature: GeoFeature, index: number) => {
			const value = choropleth?.data.find((d) => d.id === feature.id)?.value
			setTooltipData({ feature, index, value })
		},
		[choropleth],
	)

	const hideTooltip = useCallback(() => setTooltipData(null), [])

	const getRegionState = (feature: GeoFeature, index: number) =>
		({
			feature,
			index,
			isSelected: selectedIds.includes(feature.id),
			isHovered: false,
			value: choropleth?.data.find((d) => d.id === feature.id)?.value,
		}) satisfies GeoRegionState

	return {
		tooltipData,
		showTooltip,
		hideTooltip,
		getRegionState,
		getChoroFill,
		floatingRef: refs.setFloating,
		floatingStyles,
		onRegionMouseMove,
	}
}
