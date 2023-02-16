import { Meta, StoryObj } from '@storybook/react'
import { ColorHover } from '.'

const storyGroup = 'components/'
const storyName = 'ColorHover'
const meta: Meta<typeof ColorHover> = {
  title: `${storyGroup}${storyName}`,
  component: ColorHover,
}
export default meta
type Story = StoryObj<typeof ColorHover>

export const Default: Story = {
  storyName,
  render: (args) => (
    <ColorHover color='currentcolor' {...args}>
      Hover Me
    </ColorHover>
  ),
  argTypes: {
    color: { control: { type: 'color' } },
    as: { control: { type: 'select', options: ['h1', 'span', 'a', 'div'] } },
    style: { table: { disable: true } },
  },
}
