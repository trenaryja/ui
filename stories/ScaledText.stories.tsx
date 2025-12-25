import { ScaledText } from '@/components'
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
			<div className='demo *:w-full *:max-w-md'>
				<textarea
					className='textarea text-center field-sizing-content'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>

				<div className='w-60 overflow-auto rounded-box p-4 fill-current'>
					<ScaledText lines={lines} />
				</div>
			</div>
		)
	},
}
