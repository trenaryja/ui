import { Slider, SliderProps } from '@mantine/core'
import chroma, { Color } from 'chroma-js'
import { useMemo, useState } from 'react'
import { ChromaColor } from '../utils'
import { getThumbColor, sliderGradient } from './utils'

export type GradientSliderProps = Omit<SliderProps, ''> & {
  showLabel?: boolean
  gradient: ChromaColor[]
  thumbColor?: ChromaColor
  onChange?: (value: number, color?: Color) => void
  includeColorOnChange?: boolean
}

export const GradientSlider = ({
  onChange,
  includeColorOnChange = false,
  styles,
  label,
  showLabel = false,
  min = 0,
  max = 100,
  value,
  defaultValue,
  gradient,
  thumbColor,
  ...props
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
    <Slider
      label={showLabel ? label : null}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      styles={{
        thumb: {
          borderColor: thumbHex,
          backgroundColor: thumbHex,
          ':focus': { outlineColor: thumbHex },
        },
        bar: {
          display: 'none',
        },
        track: {
          '::before': { background: trackBackground },
        },
        ...styles,
      }}
      {...props}
      onChange={handleChange}
    />
  )
}
