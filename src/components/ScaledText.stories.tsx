import { ScaledText, TextArea } from '@/components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const meta = { title: 'components/ScaledText' } satisfies Meta
export default meta

export const Default: StoryObj = {
	name: 'ScaledText',
	render: () => {
		const [text, setText] = useState('Hello\nWorld\n👋🌎')

		const lines = text
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean)

		return (
			<div className='demo *:max-w-xs'>
				<TextArea className='text-center' value={text} onChange={(e) => setText(e.target.value)} />
				<ScaledText lines={lines} />
			</div>
		)
	},
}
