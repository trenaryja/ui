import { Meta, StoryObj } from '@storybook/react'
import { AsciiImage } from '.'

type Story = StoryObj<typeof AsciiImage>
const meta: Meta<typeof AsciiImage> = {
  title: 'components/AsciiImage',
  component: AsciiImage,
  argTypes: {
    characterRamp: { control: 'text' },
  },
}
export default meta

const src = 'https://source.unsplash.com/random/500x500/?face'

export const Default: Story = {
  render: (args) => <AsciiImage {...args} />,
  args: { src },
}

export const BackgroundClip: Story = {
  ...Default,
  args: {
    ...Default.args,
    preStyle: {
      fontSize: '.4em',
      backgroundImage: `url(${src})`,
      backgroundSize: 'cover',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    },
  },
}
