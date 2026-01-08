import { ThemePicker, ThemeProvider } from '@/components'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = { title: 'components/ThemePicker' } satisfies Meta
export default meta

export const Default: StoryObj = {
	name: 'ThemePicker',
	render: () => (
		<ThemeProvider>
			<div className='demo'>
				<ThemePicker />
			</div>
		</ThemeProvider>
	),
}
