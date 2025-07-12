import { Meta, StoryObj } from '@storybook/react'
import { AsciiImage } from '..'

type Story = StoryObj<typeof AsciiImage>
const meta: Meta<typeof AsciiImage> = {
  title: 'components/AsciiImage',
  component: AsciiImage,
  argTypes: {
    characterRamp: { control: 'text' },
  },
}
export default meta

const src = await fetch('https://picsum.photos/500').then((res) => res.url)

export const Default: Story = {
  render: (args) => <AsciiImage {...args} />,
  args: { src },
}

export const BackgroundClip: Story = {
  ...Default,
  args: {
    ...Default.args,
    showImage: true,
    preClassName: 'bg-clip-text text-transparent',
  },
}
