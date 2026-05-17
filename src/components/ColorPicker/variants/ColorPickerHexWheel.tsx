'use client'

import { useGamut } from '@/hooks'
import type { Hex, HexLayout, HexOrientation } from '@/utils'
import {
	buildOklch,
	cn,
	cnFn,
	getOklchCusp,
	HEX_ORIGIN,
	hexDiskBounds,
	hexSpiralAt,
	hexToPixel,
	hexToSvgPoints,
	isDark,
	toColorFormat,
} from '@/utils'
import { useState } from 'react'
import { LuCircleDot } from 'react-icons/lu'
import type { ColorPickerHexWheelProps, Gamut } from '../ColorPicker.types'
import { LightnessSlider } from '../LightnessSlider'

type CellOpts = {
	rings: number
	orientation: HexOrientation
	gamut: Gamut
}

const cellColor = ({ q, r }: Hex, { rings, orientation, gamut }: CellOpts, centerL: number) => {
	const { x, y } = hexToPixel({ q, r }, { orientation, size: 1 })
	const dist = Math.sqrt(x * x + y * y)
	if (dist === 0) return buildOklch(centerL, 0, 0)
	const t = Math.min(dist / (rings * Math.sqrt(3)), 1)
	const hDeg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
	const [lCusp, cCusp] = getOklchCusp(hDeg, gamut)
	return buildOklch((1 - t) * centerL + t * lCusp, t * cCusp, hDeg)
}

export const ColorPickerHexWheel = ({
	defaultValue,
	onChange,
	rings = 6,
	defaultLightness = 0.25,
	gamut: gamutProp,
	format = 'oklch',
	orientation = 'flat',
	className,
	classNames,
	...props
}: ColorPickerHexWheelProps) => {
	const size = 16
	const layout: HexLayout = { orientation, size }
	const detectedGamut = useGamut()
	const gamut = gamutProp ?? detectedGamut
	const [selectedHex, setSelectedHex] = useState<Hex | null>(null)
	const [centerL, setCenterL] = useState(defaultLightness)

	const bounds = hexDiskBounds(rings, layout, 2)
	const dim = Math.max(bounds.width, bounds.height)
	const padX = (dim - bounds.width) / 2
	const padY = (dim - bounds.height) / 2
	const viewBox = `${bounds.minX - padX} ${bounds.minY - padY} ${dim} ${dim}`

	const cellOpts: CellOpts = { rings, orientation, gamut }
	const cells = hexSpiralAt(HEX_ORIGIN, rings)

	const handleSelect = (q: number, r: number) => {
		setSelectedHex({ q, r })
		const color = cellColor({ q, r }, cellOpts, centerL)
		onChange?.(toColorFormat(color, format))
	}

	return (
		<div {...props} className={cn('flex flex-col items-center gap-2', className)}>
			<div className='flex-1 min-h-0 w-full'>
				<svg viewBox={viewBox} shapeRendering='crispEdges' className={cn('size-full', classNames?.svg)}>
					{cells.map(({ q, r }) => {
						const center = hexToPixel({ q, r }, layout)
						const color = cellColor({ q, r }, cellOpts, centerL)
						const isSelected = selectedHex?.q === q && selectedHex?.r === r
						return (
							<g key={`${q},${r}`} onClick={() => handleSelect(q, r)} className='cursor-pointer'>
								<polygon
									points={hexToSvgPoints({ q, r }, layout)}
									style={{ fill: color }}
									className={classNames?.cell ? cnFn(classNames.cell, { q, r, isSelected, color }) : undefined}
								/>
								{isSelected && (
									<foreignObject x={center.x - size} y={center.y - size} width={size * 2} height={size * 2}>
										<div className='size-full grid place-items-center'>
											<LuCircleDot style={{ color: isDark(color) ? '#fff' : '#000' }} />
										</div>
									</foreignObject>
								)}
							</g>
						)
					})}
				</svg>
			</div>
			<LightnessSlider value={centerL} onChange={setCenterL} className={classNames?.lightness} />
		</div>
	)
}
