import { Meta, StoryObj } from '@storybook/react'

const storyGroup = ''
const storyName = 'Welcome'
const meta: Meta = {
  title: `${storyGroup}${storyName}`,
  component: () => null,
}
export default meta

const storyContent = () => {
  return <></>
}

export const Default: StoryObj = {
  storyName,
  parameters: { docs: { page: storyContent } },
  render: () => storyContent(),
}
