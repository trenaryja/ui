import { ColorPicker, ColorPickerPreview, Field, RadioGroup, Range, toast, Toggle } from '@/components'
import { useGamut } from '@/hooks'
import type { Gamut, HexOrientation } from '@/utils'
import { COLOR_FORMATS, GAMUTS, isTailwindColor, tailwindPaletteMap, toColorFormat } from '@/utils'
import type { DemoMeta } from '@demo'
import { useState } from 'react'
import type { ColorFormat } from './ColorPicker.types'

export const meta: DemoMeta = {
	title: 'ColorPicker',
	category: 'components',
	tags: ['input'],
}

const DEFAULT_LCH = 'oklch(50% 0.28 280)'

const orientations: HexOrientation[] = ['flat', 'pointy']

const showColorToast = (color: string) => toast.custom(() => <ColorPickerPreview color={color} />)

export function Demo() {
	const defaultGamut = useGamut()
	const [rings, setRings] = useState(6)
	const [hexFormat, setHexFormat] = useState<ColorFormat>('oklch')
	const [hexGamut, setHexGamut] = useState<Gamut>(defaultGamut)
	const [orientation, setOrientation] = useState<HexOrientation>('flat')
	const [showColorNames, setShowColorNames] = useState(true)
	const [showShadeLabels, setShowShadeLabels] = useState(true)
	const [tailwindFormat, setTailwindFormat] = useState<ColorFormat>('tailwind')
	const [lchColor, setLchColor] = useState(DEFAULT_LCH)
	const [lchFormat, setLchFormat] = useState<ColorFormat>('oklch')
	const [lchGamut, setLchGamut] = useState<Gamut>(defaultGamut)

	return (
		<div className='flex flex-col gap-6 p-4'>
			<section className='surface surface-base-200 flex flex-col gap-4 p-4'>
				<h2 className='text-sm font-semibold uppercase tracking-wide opacity-60'>Hex Wheel</h2>
				<div className='flex flex-wrap justify-center gap-x-8 gap-y-2'>
					<Field label='Rings' hint={rings} hintPlacement='top-end'>
						<Range
							min={1}
							max={12}
							step={1}
							value={rings}
							className='range-xs'
							onChange={(e) => setRings(e.target.valueAsNumber)}
						/>
					</Field>
					<Field label='Orientation'>
						<RadioGroup
							variant='btn'
							options={orientations}
							value={orientation}
							onChange={(e) => setOrientation(e.target.value as HexOrientation)}
							classNames={{ item: 'btn-xs' }}
						/>
					</Field>
					<Field label='Gamut'>
						<RadioGroup
							variant='btn'
							options={GAMUTS}
							value={hexGamut}
							onChange={(e) => setHexGamut(e.target.value as Gamut)}
							classNames={{ item: 'btn-xs' }}
						/>
					</Field>
					<Field label='Output format'>
						<RadioGroup
							variant='btn'
							options={COLOR_FORMATS}
							value={hexFormat}
							onChange={(e) => setHexFormat(e.target.value as ColorFormat)}
							classNames={{ item: 'btn-xs' }}
						/>
					</Field>
				</div>
				<ColorPicker
					rings={rings}
					gamut={hexGamut}
					format={hexFormat}
					orientation={orientation}
					onChange={showColorToast}
					className='max-w-sm mx-auto w-full'
				/>
			</section>

			<section className='surface surface-base-200 flex flex-col gap-4 p-4'>
				<h2 className='text-sm font-semibold uppercase tracking-wide opacity-60'>Tailwind</h2>
				<div className='flex flex-wrap justify-center gap-x-8 gap-y-2'>
					<Field label='Color names'>
						<Toggle checked={showColorNames} onChange={(e) => setShowColorNames(e.target.checked)} />
					</Field>
					<Field label='Shade labels'>
						<Toggle checked={showShadeLabels} onChange={(e) => setShowShadeLabels(e.target.checked)} />
					</Field>
					<Field label='Output format'>
						<RadioGroup
							variant='btn'
							options={COLOR_FORMATS}
							value={tailwindFormat}
							onChange={(e) => setTailwindFormat(e.target.value as ColorFormat)}
							classNames={{ item: 'btn-xs' }}
						/>
					</Field>
				</div>
				<ColorPicker
					variant='tailwind'
					showColorNames={showColorNames}
					showShadeLabels={showShadeLabels}
					format={tailwindFormat}
					onChange={showColorToast}
				/>
			</section>

			<section className='surface surface-base-200 flex flex-col gap-4 p-4'>
				<h2 className='text-sm font-semibold uppercase tracking-wide opacity-60'>LCH Sliders</h2>
				<div className='flex flex-wrap justify-center gap-x-8 gap-y-2'>
					<Field label='Gamut'>
						<RadioGroup
							variant='btn'
							options={GAMUTS}
							value={lchGamut}
							onChange={(e) => setLchGamut(e.target.value as Gamut)}
							classNames={{ item: 'btn-xs' }}
						/>
					</Field>
					<Field label='Output format'>
						<RadioGroup
							variant='btn'
							options={COLOR_FORMATS}
							value={lchFormat}
							onChange={(e) => {
								const newFormat = e.target.value as ColorFormat
								setLchFormat(newFormat)
								const colorCss = isTailwindColor(lchColor) ? tailwindPaletteMap[lchColor].oklch : lchColor
								setLchColor(toColorFormat(colorCss, newFormat))
							}}
							classNames={{ item: 'btn-xs' }}
						/>
					</Field>
				</div>
				<ColorPicker
					variant='lch'
					defaultValue={DEFAULT_LCH}
					gamut={lchGamut}
					format={lchFormat}
					onChange={setLchColor}
					className='max-w-sm mx-auto w-full'
				/>
				<ColorPickerPreview color={lchColor} className='max-w-sm mx-auto w-full' />
			</section>
		</div>
	)
}
