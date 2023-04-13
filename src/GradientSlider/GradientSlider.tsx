import { Slider, SliderProps } from '@mantine/core'
import chroma, { Color } from 'chroma-js'
import { useMemo, useState } from 'react'
import { ChromaColor } from '../utils'
import { sliderGradient } from './utils'

export type GradientSliderProps = Omit<SliderProps, ''> & {
  showLabel?: boolean
  gradient: ChromaColor[]
  onChange?: (value: number, color: Color) => void
}

export const GradientSlider = ({
  onChange,
  styles,
  label,
  showLabel = false,
  min = 0,
  max = 100,
  value,
  defaultValue,
  gradient,
  ...props
}: GradientSliderProps) => {
  const scale = useMemo(() => chroma.scale(gradient.map((x) => chroma(x))).domain([min, max]), [gradient, min, max])
  const [_thumbColor, setThumbColor] = useState<string>(scale(defaultValue ?? 0).hex())
  const thumbColor = value === undefined ? _thumbColor : scale(value).hex()
  const trackBackground = sliderGradient(gradient.map((x) => chroma(x).hex()))

  const handleChange = (newValue: number) => {
    const color = scale(newValue)
    setThumbColor(color.hex())
    onChange?.(newValue, color)
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
          borderColor: thumbColor,
          backgroundColor: thumbColor,
          ':focus': { outlineColor: thumbColor },
        },
        bar: {
          display: 'none',
        },
        track: {
          '::before': {
            backgroundImage: `linear-gradient(to right, white, black)`,
            background: trackBackground,
          },
        },
        ...styles,
      }}
      {...props}
      onChange={handleChange}
    />
  )
}
