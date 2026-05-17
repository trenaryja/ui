'use client'

import { ColorButton } from '@/components/ColorButton/ColorButton'
import type { TailwindColorName, TailwindShade } from '@/utils'
import { cn, cnFn, tailwindColors, tailwindPalette, toColorFormat } from '@/utils'
import { Fragment, useState } from 'react'
import { LuCircleDot } from 'react-icons/lu'
import * as R from 'remeda'
import type { ColorPickerTailwindProps } from '../ColorPicker.types'

const PALETTE_NAMES = R.unique(tailwindPalette.map((x) => x.baseName))
const PALETTE_SHADES = R.keys(tailwindColors.slate)

export const ColorPickerTailwind = ({
	value,
	defaultValue,
	showColorNames = true,
	showShadeLabels = true,
	onChange,
	format = 'oklch',
	className,
	classNames,
	...props
}: ColorPickerTailwindProps) => {
	// Visual selection is only trackable by key when format is 'tailwind'.
	// Other formats emit raw color strings that can't be cheaply reverse-mapped to a palette key.
	const [internalKey, setInternalKey] = useState<string | null>(format === 'tailwind' ? (defaultValue ?? null) : null)
	const selectedKey = format === 'tailwind' && value != null ? value : internalKey

	const handleClick = (name: TailwindColorName, shade: TailwindShade) => {
		const color = tailwindColors[name][shade]
		const key = `${name}-${shade}`
		setInternalKey(key)
		onChange?.(format === 'tailwind' ? key : toColorFormat(color, format))
	}

	return (
		<div
			{...props}
			className={cn('grid gap-0.5', className)}
			style={{
				gridTemplateColumns: `${showColorNames ? 'auto ' : ''}repeat(${PALETTE_SHADES.length}, 1fr)`,
				...props.style,
			}}
		>
			{showShadeLabels && (
				<>
					{showColorNames && <div />}
					{PALETTE_SHADES.map((shade) => (
						<span key={shade} className={cn('pb-1 text-center font-mono text-xs', classNames?.shadeLabel)}>
							{shade}
						</span>
					))}
				</>
			)}

			{PALETTE_NAMES.map((name) => (
				<Fragment key={name}>
					{showColorNames && (
						<span className={cn('flex items-center justify-end pr-2 text-sm', classNames?.colorLabel)}>{name}</span>
					)}
					{PALETTE_SHADES.map((shade) => {
						const key = `${name}-${shade}` as const
						const color = tailwindColors[name][shade]
						const isSelected = selectedKey === key
						return (
							<ColorButton
								key={key}
								onClick={() => handleClick(name, shade)}
								className={cn(
									'btn-xs text-base hover:[--btn-bg:var(--btn-color)]',
									cnFn(classNames?.swatch, { name, shade, key, color, isSelected }),
								)}
								color={key}
							>
								{isSelected && <LuCircleDot />}
							</ColorButton>
						)
					})}
				</Fragment>
			))}
		</div>
	)
}
