import { Meta, StoryObj } from '@storybook/react'
import colors from 'tailwindcss/colors'
import { ColorHover } from '..'

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
  args: { color: colors.neutral[500], children: 'Hover Me' },
}
