import { DEFAULT_THEME } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import { ColorHover } from '.'

type Story = StoryObj<typeof ColorHover>
const meta: Meta<typeof ColorHover> = {
  title: 'components/ColorHover',
  component: ColorHover,
  argTypes: {
    color: { control: 'color' },
    as: { control: 'radio', options: ['div', 'h1', 'span'] },
    style: { table: { disable: true } },
  },
}
export default meta

export const Default: Story = {
  name: 'ColorHover',
  render: (args) => <ColorHover {...args}>Hover Me</ColorHover>,
  args: { color: DEFAULT_THEME.colors.dark[5] },
}
