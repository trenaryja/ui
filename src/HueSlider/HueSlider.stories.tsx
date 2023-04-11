import { Flex, Slider, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import tinycolor from 'tinycolor2'
import { HueSlider } from '.'

type Story = StoryObj<typeof HueSlider>
const meta: Meta<typeof HueSlider> = {
  title: 'components/HueSlider',
  component: HueSlider,
}
export default meta

export const Default: Story = {
  argTypes: {
    value: { control: { type: 'color' } },
    defaultValue: { control: { type: 'color' } },
    onChange: { table: { disable: true } },
  },
}

export const Controlled: Story = {
  name: 'Controlled vs Uncontrolled',
  render: () => {
    const [hue, setHue] = useState(20)
    return (
      <Flex direction='column' gap='lg'>
        <h1>Uncontrolled</h1>
        <HueSlider />
        <h1>Controlled</h1>
        <HueSlider value={hue} onChange={(x) => setHue(x)} />
        <h1>Controlled & Locked</h1>
        <HueSlider value={hue} />
      </Flex>
    )
  },
}

export const ColorPicker: Story = {
  render: () => {
    const [hue, setHue] = useState(0)
    const [saturation, setSaturation] = useState(100)
    const [lightness, setLightness] = useState(50)
    const [alpha, setAlpha] = useState(1)
    const color = tinycolor(`hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`)
    return (
      <Flex gap='lg'>
        <Flex direction='column' gap='lg' w='100%' justify='space-between'>
          <HueSlider value={hue} onChange={(x) => setHue(x)} />
          <Slider value={saturation} onChange={(x) => setSaturation(x)} />
          <Slider value={lightness} onChange={(x) => setLightness(x)} />
        </Flex>
        <Flex direction='column' w='10em' align='center'>
          <svg viewBox='0 0 1 1'>
            <rect width={1} height={1} fill={`#${color.toHex8()}`} />
          </svg>
          <Text fw='bolder' fz='lg'>
            {color.toHex()}
          </Text>
        </Flex>
      </Flex>
    )
  },
}
