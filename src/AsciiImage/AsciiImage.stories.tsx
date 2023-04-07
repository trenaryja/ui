import { Meta, StoryObj } from '@storybook/react'
import { AsciiImage } from '.'

type Story = StoryObj<typeof AsciiImage>
const meta: Meta<typeof AsciiImage> = {
  title: 'components/AsciiImage',
  component: AsciiImage,
}
export default meta

export const Default: Story = {
  name: 'AsciiImage',
  render: (args) => {
    const src = 'https://source.unsplash.com/random/500x500/?face'
    return <AsciiImage {...args} src={args.src ?? src} />
  },
}
