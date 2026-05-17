'use client'

import { useGamut } from '@/hooks'
import { buildOklch, cn, getMaxChroma, toColorFormat } from '@/utils'
import { colordx } from '@colordx/core'
import { useDidUpdate } from '@mantine/hooks'
import { useState } from 'react'
import { ChromaSlider } from '../ChromaSlider'
import type { ColorPickerLCHProps } from '../ColorPicker.types'
import { HueSlider } from '../HueSlider'
import { LightnessSlider } from '../LightnessSlider'

const DEFAULT_LCH = 'oklch(50% 0.28 280)'

export const ColorPickerLCH = ({
	value,
	defaultValue,
	onChange,
	gamut,
	format = 'oklch',
	className,
	classNames,
	...props
}: ColorPickerLCHProps) => {
	const detectedGamut = useGamut()
	const resolvedGamut = gamut ?? detectedGamut
	const parsed = colordx(defaultValue ?? DEFAULT_LCH).toOklch()
	const [lightness, setLightness] = useState(parsed.l)
	const [hue, setHue] = useState(parsed.h)
	const [chromaRatio, setChromaRatio] = useState(() => {
		const max = getMaxChroma(parsed.l, parsed.h, resolvedGamut)
		return max > 0 ? parsed.c / max : 0
	})

	const chromaMax = getMaxChroma(lightness, hue, resolvedGamut)
	const chroma = chromaRatio * chromaMax

	const emit = (l: number, c: number, h: number) => {
		const color = buildOklch(l, c, h)
		onChange?.(toColorFormat(color, format))
	}

	useDidUpdate(() => {
		emit(lightness, chromaRatio * getMaxChroma(lightness, hue, resolvedGamut), hue)
	}, [resolvedGamut])

	return (
		<div {...props} className={cn('flex flex-col gap-2', className)}>
			<LightnessSlider
				value={lightness}
				onChange={(l) => {
					setLightness(l)
					emit(l, chromaRatio * getMaxChroma(l, hue, resolvedGamut), hue)
				}}
				className={classNames?.lightness}
			/>
			<ChromaSlider
				chroma={chroma}
				chromaMax={chromaMax}
				onRatioChange={(ratio) => {
					setChromaRatio(ratio)
					emit(lightness, ratio * chromaMax, hue)
				}}
				lightness={lightness}
				hue={hue}
				className={classNames?.chroma}
			/>
			<HueSlider
				value={hue}
				onChange={(h) => {
					setHue(h)
					emit(lightness, chromaRatio * getMaxChroma(lightness, h, resolvedGamut), h)
				}}
				className={classNames?.hue}
			/>
		</div>
	)
}
