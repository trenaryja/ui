import { Slider, SliderProps } from '@mantine/core'
import { useMemo, useState } from 'react'
import tinycolor from 'tinycolor2'
import { getColorFromHue, getHue, hueColors, sliderGradient } from './utils'

export type HueSliderProps = Omit<SliderProps, 'value' | 'defaultValue'> & {
  showLabel?: boolean
  value?: number | tinycolor.ColorInput
  defaultValue?: number | tinycolor.ColorInput
}

export const HueSlider = ({
  onChange,
  styles,
  label,
  showLabel = false,
  min = 0,
  max = 360,
  value,
  defaultValue,
  ...props
}: HueSliderProps) => {
  const _value = useMemo(() => getHue(value), [value])
  const _defaultValue = useMemo(() => getHue(defaultValue) ?? 0, [defaultValue])
  const [_thumbColor, setThumbColor] = useState<tinycolor.Instance>(getColorFromHue(_defaultValue, min, max))
  const thumbColor = _value === undefined ? _thumbColor : getColorFromHue(_value, min, max)
  const thumbHex = `#${thumbColor.toHex()}`

  const handleChange = (newValue: number) => {
    setThumbColor(getColorFromHue(newValue, min, max))
    onChange?.(newValue)
  }

  return (
    <Slider
      label={showLabel ? label : null}
      value={_value}
      defaultValue={_defaultValue}
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
          '::before': { background: sliderGradient(hueColors) },
        },
        ...styles,
      }}
      {...props}
      onChange={handleChange}
    />
  )
}
