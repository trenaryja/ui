import { DEFAULT_THEME } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import { ColorHover } from '.'

type Story = StoryObj<typeof ColorHover>
const meta: Meta<typeof ColorHover> = {
  title: 'components/ColorHover',
  component: ColorHover,
}
export default meta

export const Default: Story = {
  name: 'ColorHover',
  render: (args) => (
    <ColorHover {...args} color={args.color ?? DEFAULT_THEME.colors.dark[5]}>
      Hover Me
    </ColorHover>
  ),
  argTypes: {
    color: { control: { type: 'color' } },
    as: { control: { type: 'select', options: ['h1', 'span', 'a', 'div'] } },
    style: { table: { disable: true } },
  },
}
