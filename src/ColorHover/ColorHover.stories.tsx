import { Meta, StoryObj } from '@storybook/react'
import { ColorHover } from '..'

type Story = StoryObj<typeof ColorHover>
const meta: Meta<typeof ColorHover> = {
  title: 'components/ColorHover',
  component: ColorHover,
  argTypes: {
    as: { control: 'radio', options: ['div', 'h1', 'span'] },
    className: {
      control: 'select',
      options: ['before:bg-red-500', 'before:bg-blue-500', 'before:bg-green-500', 'before:bg-neutral-500'],
      defaultValue: 'before:bg-neutral-500',
    },
  },
}
export default meta

export const Default: Story = {
  name: 'ColorHover',
  args: { children: 'Hover Me' },
}
