import { AsciiVideo } from '@/components'
import { Meta, StoryObj } from '@storybook/react-vite'

type Story = StoryObj<typeof AsciiVideo>
const meta: Meta<typeof AsciiVideo> = {
	title: 'components/AsciiVideo',
	component: AsciiVideo,
	argTypes: {
		characterRamp: { control: 'text' },
	},
}
export default meta

const src = `https://upload.wikimedia.org/wikipedia/commons/transcoded/a/ab/Geometric_--_Free_Vj_Loops.webm/Geometric_--_Free_Vj_Loops.webm.720p.vp9.webm`

export const Default: Story = {
	name: 'AsciiVideo',
	render: (args) => <AsciiVideo {...args} />,
	args: { src },
}
