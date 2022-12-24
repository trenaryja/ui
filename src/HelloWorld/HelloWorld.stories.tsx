import { Meta, StoryObj } from '@storybook/react'
import { HelloWorld } from '.'

const storyGroup = 'components/'
const storyName = 'HelloWorld'
const meta: Meta<typeof HelloWorld> = {
  title: `${storyGroup}${storyName}`,
  component: HelloWorld,
}
export default meta
type Story = StoryObj<typeof HelloWorld>

export const Default: Story = { storyName }
