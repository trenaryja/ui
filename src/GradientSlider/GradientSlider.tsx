import * as Slider from '@radix-ui/react-slider'
import chroma, { Color } from 'chroma-js'
import { useMemo, useState } from 'react'
import { ChromaColor } from '../utils'
import { getThumbColor, sliderGradient } from './utils'

export type GradientSliderProps = {
  min?: number
  max?: number
  value?: number
  defaultValue?: number
  gradient: ChromaColor[]
  thumbColor?: ChromaColor
  onChange?: (value: number, color?: Color) => void
  includeColorOnChange?: boolean
}

export const GradientSlider = ({
  onChange,
  includeColorOnChange = false,
  min = 0,
  max = 100,
  value,
  defaultValue,
  gradient,
  thumbColor,
}: GradientSliderProps) => {
  const gradientColors = useMemo(() => gradient.map((x) => chroma(x)), [gradient])
  const trackBackground = useMemo(() => sliderGradient(gradientColors), [gradientColors])
  const scale = useMemo(() => {
    if (thumbColor) return undefined
    return chroma.scale(gradientColors).domain([min, max])
  }, [gradientColors, min, max])
  const [_thumbColor, setThumbColor] = useState(getThumbColor(thumbColor, scale, defaultValue ?? 0))
  const thumbHex = getThumbColor(thumbColor, scale, value, _thumbColor).hex()

  const handleChange = (newValue: number) => {
    if ((includeColorOnChange || thumbColor === undefined) && scale !== undefined) {
      const color = scale(newValue)
      if (thumbColor === undefined) setThumbColor(color)
      onChange?.(newValue, color)
      return
    }
    onChange?.(newValue)
  }

  return (
    <div className='grid gap-10'>
      <Slider.Root
        value={value === undefined ? value : [value]}
        defaultValue={defaultValue === undefined ? defaultValue : [defaultValue]}
        onValueChange={(x) => handleChange(x[0])}
        min={min}
        max={max}
        className='h-4 relative flex items-center select-none touch-none w-full'
      >
        <Slider.Track style={{ background: trackBackground }} className='bg-red-500 relative grow rounded-full h-2' />
        <Slider.Thumb style={{ background: thumbHex }} className='block w-4 h-4 rounded-full focus:outline-none' />
      </Slider.Root>
    </div>
  )
}
