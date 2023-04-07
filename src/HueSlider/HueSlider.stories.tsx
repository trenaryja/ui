import { Meta, StoryObj } from '@storybook/react'
import { HueSlider } from '.'

type Story = StoryObj<typeof HueSlider>
const meta: Meta<typeof HueSlider> = {
  title: 'components/HueSlider',
  component: HueSlider,
}
export default meta

export const Default: Story = { name: 'HueSlider' }
