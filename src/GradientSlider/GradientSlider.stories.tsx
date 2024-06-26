import { Meta, StoryObj } from '@storybook/react'
import chroma from 'chroma-js'
import React from 'react'
import { GradientSlider, GradientSliderProps, HueSlider } from '..'

type Story = StoryObj<typeof GradientSlider>
const meta: Meta<typeof GradientSlider> = {
  title: 'components/GradientSlider',
  component: GradientSlider,
}
export default meta

const defaultArgs: GradientSliderProps = {
  gradient: ['red', 'green', 'blue'],
}

export const Default: Story = {
  argTypes: {
    onChange: { table: { disable: true } },
  },
  args: defaultArgs,
}

export const Controlled: Story = {
  name: 'Controlled vs Uncontrolled',
  render: () => {
    const [hue, setHue] = React.useState(50)
    return (
      <div className='grid gap-10'>
        <h1>Uncontrolled</h1>
        <GradientSlider {...defaultArgs} />
        <h1>Controlled</h1>
        <GradientSlider {...defaultArgs} value={hue} onChange={(x) => setHue(x)} />
        <h1>Controlled & Locked</h1>
        <GradientSlider {...defaultArgs} value={hue} />
      </div>
    )
  },
}

export const ColorPicker: Story = {
  render: () => {
    const [hue, setHue] = React.useState(0)
    const [saturation, setSaturation] = React.useState(1)
    const [lightness, setLightness] = React.useState(0.5)
    const [alpha, setAlpha] = React.useState(1)
    const color = chroma(hue, saturation, lightness, 'hsl').alpha(alpha)
    const thumbColor = color.hex('rgb')
    return (
      <div className='flex gap-10'>
        <div className='flex flex-col gap-5 w-full justify-between'>
          <HueSlider thumbColor={thumbColor} value={hue} onChange={(x) => setHue(x)} />
          <GradientSlider
            thumbColor={thumbColor}
            gradient={[chroma(hue, 0, lightness, 'hsl'), chroma(hue, 1, lightness, 'hsl')]}
            max={255}
            value={saturation * 255}
            onChange={(x) => setSaturation(x / 255)}
          />
          <GradientSlider
            thumbColor={thumbColor}
            gradient={[
              chroma(hue, saturation, 0, 'hsl'),
              chroma(hue, saturation, 0.5, 'hsl'),
              chroma(hue, saturation, 1, 'hsl'),
            ]}
            max={255}
            value={lightness * 255}
            onChange={(x) => setLightness(x / 255)}
          />
          <GradientSlider
            thumbColor={thumbColor}
            gradient={['#0000', thumbColor]}
            max={255}
            value={alpha * 255}
            onChange={(x) => setAlpha(x / 255)}
          />
        </div>
        <div className='flex flex-col w-40 items-center'>
          <svg viewBox='0 0 1 1'>
            <rect width={1} height={1} fill={color.hex()} />
          </svg>
          <p className='font-extrabold text-lg'>{color.hex()}</p>
        </div>
      </div>
    )
  },
}
