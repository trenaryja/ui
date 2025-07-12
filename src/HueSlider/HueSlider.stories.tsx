import { Meta, StoryObj } from '@storybook/react-vite'
import { HueSlider } from '..'

type Story = StoryObj<typeof HueSlider>
const meta: Meta<typeof HueSlider> = {
	title: 'components/HueSlider',
	component: HueSlider,
}
export default meta

export const Default: Story = {
	name: 'HueSlider',
	argTypes: {
		value: { control: { type: 'color' } },
		defaultValue: { control: { type: 'color' } },
		onChange: { table: { disable: true } },
	},
}
