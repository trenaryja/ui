import { Meta, StoryObj } from '@storybook/react'
import { AsciiImage } from '.'

const storyGroup = 'components/'
const storyName = 'AsciiImage'
const meta: Meta<typeof AsciiImage> = {
  title: `${storyGroup}${storyName}`,
  component: AsciiImage,
}
export default meta
type Story = StoryObj<typeof AsciiImage>

export const Default: Story = {
  storyName,
  render: (args) => {
    const src = 'https://source.unsplash.com/random/500x500/?face'
    return <AsciiImage src={src} {...args} />
  },
}
