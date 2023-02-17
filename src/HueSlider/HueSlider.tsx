import { Slider, SliderProps } from '@mantine/core'
import { useState } from 'react'
import { mapRange } from '../utils'

export type HueSliderProps = SliderProps & {
  showLabel?: boolean
}

const calculateHsl = (value: number) => `hsl(${Math.round(mapRange(value, 0, 100, 0, 360))} 100% 50%)`
const average = (min: number | undefined, max: number | undefined) => ((min ?? 0) + (max ?? 100)) / 2

export const HueSlider = (props: HueSliderProps) => {
  const { onChange, showLabel, label, min, max, defaultValue = average(min, max) } = props
  const [color, setColor] = useState<string>(calculateHsl(defaultValue))

  const handleChange = (value: number) => {
    setColor(calculateHsl(value))
    onChange?.(value)
  }

  return (
    <Slider
      label={showLabel ? label : null}
      defaultValue={defaultValue}
      styles={{
        thumb: {
          borderColor: color,
          backgroundColor: color,
          ':focus': {
            outlineColor: color,
          },
        },
        bar: { display: 'none' },
        track: {
          '::before': {
            background:
              'linear-gradient( to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100% )',
          },
        },
      }}
      {...props}
      onChange={handleChange}
    />
  )
}
