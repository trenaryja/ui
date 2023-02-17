import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { HueSlider } from '.'

const storyGroup = 'components/'
const storyName = 'HueSlider'
const meta: Meta<typeof HueSlider> = {
  title: `${storyGroup}${storyName}`,
  component: HueSlider,
}
export default meta
type Story = StoryObj<typeof HueSlider>

export const Default: Story = { storyName }

export const Test: Story = {
  render: () => {
    const [hue, setHue] = useState(50)

    return (
      <>
        <HueSlider value={hue} onChange={setHue} />
      </>
    )
  },
}
