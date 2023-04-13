import { Flex, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import chroma from 'chroma-js'
import { useState } from 'react'
import { GradientSlider } from '.'
import { HueSlider } from '../HueSlider'

type Story = StoryObj<typeof GradientSlider>
const meta: Meta<typeof GradientSlider> = {
  title: 'components/GradientSlider',
  component: GradientSlider,
}
export default meta

export const Default: Story = {
  argTypes: {
    onChange: { table: { disable: true } },
  },
  args: {
    gradient: ['red', 'green', 'blue'],
  },
}

export const Controlled: Story = {
  name: 'Controlled vs Uncontrolled',
  render: () => {
    const [hue, setHue] = useState(50)
    return (
      <Flex direction='column' gap='lg'>
        <h1>Uncontrolled</h1>
        <GradientSlider {...Default.args} />
        <h1>Controlled</h1>
        <GradientSlider {...Default.args} value={hue} onChange={(x) => setHue(x)} />
        <h1>Controlled & Locked</h1>
        <GradientSlider {...Default.args} value={hue} />
      </Flex>
    )
  },
}

export const ColorPicker: Story = {
  render: () => {
    const [hue, setHue] = useState(0)
    const [saturation, setSaturation] = useState(100)
    const [lightness, setLightness] = useState(50)
    const [alpha, setAlpha] = useState(100)
    const color = chroma(hue, saturation / 100, lightness / 100, 'hsl').alpha(alpha / 100)
    return (
      <Flex gap='lg'>
        <Flex direction='column' gap='lg' w='100%' justify='space-between'>
          <HueSlider value={hue} onChange={(x) => setHue(x)} />
          <GradientSlider
            gradient={[color.set('hsl.s', 0).hex('rgb'), color.set('hsl.s', 1).hex('rgb')]}
            value={saturation}
            onChange={(x) => setSaturation(x)}
          />
          <GradientSlider
            gradient={[
              color.set('hsl.l', 0).hex('rgb'),
              color.set('hsl.l', 0.5).hex('rgb'),
              color.set('hsl.l', 1).hex('rgb'),
            ]}
            value={lightness}
            onChange={(x) => setLightness(x)}
          />
          <GradientSlider gradient={[color.alpha(0), color.alpha(1)]} value={alpha} onChange={(x) => setAlpha(x)} />
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
