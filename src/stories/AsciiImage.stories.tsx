import { Meta, StoryObj } from '@storybook/react-vite'
import { AsciiImage } from '../components/AsciiImage'

type Story = StoryObj<typeof AsciiImage>
const meta: Meta<typeof AsciiImage> = {
	title: 'components/AsciiImage',
	component: AsciiImage,
	argTypes: {
		characterRamp: { control: 'text' },
	},
}
export default meta

const src = await fetch('https://picsum.photos/500').then((res) => res.url)

export const Default: Story = {
	render: (args) => <AsciiImage {...args} />,
	args: { src },
}

export const BackgroundClip: Story = {
	...Default,
	args: {
		...Default.args,
		showImage: true,
		className: 'bg-clip-text text-transparent',
	},
}
