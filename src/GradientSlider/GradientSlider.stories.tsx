import { Flex, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import chroma from 'chroma-js'
import { useState } from 'react'
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
    const [hue, setHue] = useState(50)
    return (
      <Flex direction='column' gap='lg'>
        <h1>Uncontrolled</h1>
        <GradientSlider {...defaultArgs} />
        <h1>Controlled</h1>
        <GradientSlider {...defaultArgs} value={hue} onChange={(x) => setHue(x)} />
        <h1>Controlled & Locked</h1>
        <GradientSlider {...defaultArgs} value={hue} />
      </Flex>
    )
  },
}

export const ColorPicker: Story = {
  render: () => {
    const [hue, setHue] = useState(0)
    const [saturation, setSaturation] = useState(1)
    const [lightness, setLightness] = useState(0.5)
    const [alpha, setAlpha] = useState(1)
    const color = chroma(hue, saturation, lightness, 'hsl').alpha(alpha)
    const thumbColor = color.hex('rgb')
    return (
      <Flex gap='lg'>
        <Flex direction='column' gap='lg' w='100%' justify='space-between'>
          <HueSlider thumbColor={thumbColor} value={hue} onChange={(x) => setHue(x)} />
          <GradientSlider
            thumbColor={thumbColor}
            gradient={[chroma(hue, 0, lightness, 'hsl'), chroma(hue, 1, lightness, 'hsl')]}
            value={saturation * 100}
            onChange={(x) => setSaturation(x / 100)}
          />
          <GradientSlider
            thumbColor={thumbColor}
            gradient={[
              chroma(hue, saturation, 0, 'hsl'),
              chroma(hue, saturation, 0.5, 'hsl'),
              chroma(hue, saturation, 1, 'hsl'),
            ]}
            value={lightness * 100}
            onChange={(x) => setLightness(x / 100)}
          />
          <GradientSlider
            thumbColor={thumbColor}
            gradient={['#0000', thumbColor]}
            value={alpha * 100}
            onChange={(x) => setAlpha(x / 100)}
          />
        </Flex>
        <Flex direction='column' w='10em' align='center'>
          <svg viewBox='0 0 1 1'>
            <rect width={1} height={1} fill={color.hex()} />
          </svg>
          <Text fw='bolder' fz='lg'>
            {color.hex()}
          </Text>
        </Flex>
      </Flex>
    )
  },
}
