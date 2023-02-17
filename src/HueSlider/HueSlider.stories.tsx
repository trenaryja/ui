import { Meta, StoryObj } from '@storybook/react'
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
