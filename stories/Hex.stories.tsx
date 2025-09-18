import { Hex } from '@/components'
import { Meta, StoryObj } from '@storybook/react-vite'

type Story = StoryObj<typeof Hex>
const meta: Meta<typeof Hex> = {
	title: 'components/Hex',
	component: Hex,
}
export default meta

export const Default: Story = { name: 'Hex', args: { className: 'bg-base-200 w-1/2' } }

export const Nested: Story = {
	render: (args) => {
		return (
			<Hex className='bg-base-200 w-1/2 p-[5%]' {...args}>
				<Hex className='bg-base-300 w-full animate-spin [animation-duration:10s]' {...args} />
			</Hex>
		)
	},
}
