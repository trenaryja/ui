import { Meta, StoryObj } from '@storybook/react-vite'
import { HexGrid } from '..'

type Story = StoryObj<typeof HexGrid>
const meta: Meta<typeof HexGrid> = {
	title: 'components/HexGrid',
	component: HexGrid,
	decorators: [
		(Story) => (
			<div className='full-bleed'>
				<Story />
			</div>
		),
	],
	argTypes: {
		center: { control: 'radio', options: ['horizontally', 'vertically'] },
		fill: { control: 'color' },
		height: { control: 'number' },
		hexScale: { control: 'number' },
		orientation: { control: 'radio', options: ['flat', 'pointy'] },
		sideLength: { control: 'number' },
		stroke: { control: 'color' },
		strokeWidth: { control: 'number' },
		styleFn: { table: { disable: true } },
		width: { control: 'number' },
	},
}
export default meta

export const Default: Story = {
	name: 'HexGrid',
}
