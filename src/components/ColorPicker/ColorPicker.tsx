'use client'

import type { HexOrientation } from '@/utils'
import { cn, hexAngle, hexDisk, hexDiskBounds, hexDistance, hexToPixel, hexToSvgPoints } from '@/utils'
import { colordx } from '@colordx/core'
import { useState } from 'react'
import { ClipboardButton } from '../ClipboardButton/ClipboardButton'
import type { ColorFormat, ColorPickerProps, ColorPickerSlot } from './ColorPicker.types'

const FORMAT_CONVERTERS: Record<ColorFormat, (c: ReturnType<typeof colordx>) => string> = {
	oklch: (c) => c.toOklchString(),
	hex: (c) => c.toHex(),
	rgb: (c) => c.toRgbString(),
	hsl: (c) => c.toHslString(),
}

const toFormat = (oklch: string, format: ColorFormat) => FORMAT_CONVERTERS[format](colordx(oklch))

type CellColorOpts = { rings: number; lightness: number; maxChroma: number; orientation: HexOrientation }

const cellColor = ({ q, r }: { q: number; r: number }, opts: CellColorOpts) => {
	const { rings, lightness, maxChroma, orientation } = opts
	const ring = hexDistance({ q, r })
	if (ring === 0) return `oklch(${lightness.toFixed(3)} 0 0)`
	const chroma = (ring / rings) * maxChroma
	const hue = hexAngle({ q, r }, orientation)
	return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(4)} ${hue.toFixed(2)})`
}

type HexCellProps = {
	q: number
	r: number
	size: number
	orientation: HexOrientation
	selected: boolean
	color: string
	onSelect: (c: string) => void
	className?: string
	selectedClassName?: string
}

const HexCell = ({
	q,
	r,
	size,
	orientation,
	selected,
	color,
	onSelect,
	className,
	selectedClassName,
}: HexCellProps) => {
	const center = hexToPixel({ q, r }, size, orientation)
	const points = hexToSvgPoints({ q, r }, size, orientation)
	return (
		<g onClick={() => onSelect(color)} className='group cursor-pointer' aria-label={color} role='button'>
			<polygon
				points={points}
				fill={color}
				stroke='black'
				strokeWidth={0.5}
				strokeOpacity={0.12}
				className={cn(selected && 'brightness-[1.15]', className, selected && selectedClassName)}
			/>
			{/* White overlay for hover/active — avoids filter compositing artifacts */}
			<polygon
				points={points}
				fill='white'
				className='pointer-events-none opacity-0 transition-opacity duration-75 group-hover:opacity-[0.12] group-active:opacity-[0.22]'
			/>
			{selected && (
				<circle
					cx={center.x}
					cy={center.y}
					r={size * 0.32}
					fill='none'
					stroke='white'
					strokeWidth={1.5}
					strokeOpacity={0.9}
					className='pointer-events-none'
				/>
			)}
		</g>
	)
}

type LightnessSliderProps = { value: number; onChange: (v: number) => void; className?: string }

const LightnessSlider = ({ value, onChange, className }: LightnessSliderProps) => (
	<label className={cn('flex w-full items-center gap-2', className)}>
		<span className='w-4 shrink-0 text-center font-mono text-xs opacity-50'>L</span>
		<div className='relative flex-1'>
			<div
				className='pointer-events-none absolute inset-y-0 left-0 right-0 my-auto h-2 rounded-full'
				style={{ background: 'linear-gradient(to right, oklch(0.1 0 0), oklch(0.65 0 0), oklch(0.99 0 0))' }}
			/>
			<input
				type='range'
				min={0}
				max={1}
				step={0.01}
				value={value}
				className='range range-xs relative z-10 opacity-0'
				aria-label='Lightness'
				onChange={(e) => onChange(e.target.valueAsNumber)}
			/>
		</div>
		<span className='w-8 shrink-0 text-right font-mono text-xs tabular-nums opacity-50'>{value.toFixed(2)}</span>
	</label>
)

type ColorPreviewProps = { color: string; copyValue: string; classNames?: Partial<Record<ColorPickerSlot, string>> }

const ColorPreview = ({ color, copyValue, classNames }: ColorPreviewProps) => (
	<div className={cn('flex w-full items-center gap-2', classNames?.preview)}>
		<div
			className='size-8 shrink-0 rounded-lg border border-base-content/10 shadow-inner'
			style={{ background: color }}
			aria-label={`Selected: ${copyValue}`}
		/>
		<span className={cn('flex-1 truncate font-mono text-xs opacity-60', classNames?.value)}>{copyValue}</span>
		<ClipboardButton copy={copyValue} className='btn-xs btn-ghost btn-square' />
	</div>
)

export const ColorPicker = ({
	value,
	defaultValue,
	onChange,
	rings = 6,
	size = 16,
	defaultLightness = 0.65,
	maxChroma = 0.4,
	format = 'oklch',
	orientation = 'flat',
	className,
	classNames,
	...props
}: ColorPickerProps) => {
	const [internalColor, setInternalColor] = useState<string | null>(defaultValue ?? null)
	const [lightness, setLightness] = useState(defaultLightness)

	const selected = value ?? internalColor
	const bounds = hexDiskBounds(rings, size, { orientation, padding: 2 })

	// Use a square viewBox so flat-top and pointy-top render the same visual size.
	const dim = Math.max(bounds.width, bounds.height)
	const padX = (dim - bounds.width) / 2
	const padY = (dim - bounds.height) / 2
	const viewBox = `${bounds.minX - padX} ${bounds.minY - padY} ${dim} ${dim}`

	const colorOpts: CellColorOpts = { rings, lightness, maxChroma, orientation }
	const displayColor = selected ?? `oklch(${lightness.toFixed(3)} 0 0)`

	const handleSelect = (oklch: string) => {
		setInternalColor(oklch)
		onChange?.(toFormat(oklch, format))
	}

	return (
		<div className={cn('flex flex-col items-center gap-3', className, classNames?.root)} {...props}>
			<svg
				viewBox={viewBox}
				className={cn('w-full cursor-pointer select-none', classNames?.svg)}
				aria-label='Color wheel'
				role='img'
			>
				{hexDisk(rings).map(({ q, r }) => {
					const color = cellColor({ q, r }, colorOpts)
					return (
						<HexCell
							key={`${q},${r}`}
							q={q}
							r={r}
							size={size}
							orientation={orientation}
							color={color}
							selected={selected === color}
							onSelect={handleSelect}
							className={classNames?.cell}
							selectedClassName={classNames?.cellSelected}
						/>
					)
				})}
			</svg>
			<LightnessSlider value={lightness} onChange={setLightness} className={classNames?.lightness} />
			<ColorPreview color={displayColor} copyValue={toFormat(displayColor, format)} classNames={classNames} />
		</div>
	)
}
