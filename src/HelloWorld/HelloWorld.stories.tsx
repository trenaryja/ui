import { Meta, StoryObj } from '@storybook/react'
import { HelloWorld } from './index'

const meta: Meta<typeof HelloWorld> = { component: HelloWorld }
export default meta
type Story = StoryObj<typeof HelloWorld>

export const Basic: Story = {}
