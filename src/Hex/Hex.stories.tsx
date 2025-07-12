import { Meta, StoryObj } from '@storybook/react-vite'
import { Hex } from '..'

type Story = StoryObj<typeof Hex>
const meta: Meta<typeof Hex> = {
  title: 'components/Hex',
  component: Hex,
}
export default meta

export const Default: Story = { name: 'Hex', args: { className: 'bg-base-200' } }

export const Nested: Story = {
  render: (args) => {
    return (
      <Hex className='bg-base-200 p-5' {...args}>
        <Hex className='bg-base-100 w-full animate-spin duration-1000' {...args} />
      </Hex>
    )
  },
}
