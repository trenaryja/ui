import { ScaledText } from '@/components'
import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const meta: Meta = { title: 'components/ScaledText' }
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
			<div className='demo'>
				<textarea className='textarea text-center' value={text} onChange={(e) => setText(e.target.value)} />

				<div className='w-60 resize-x overflow-auto border border-current/25 rounded-box p-4 fill-current'>
					<ScaledText lines={lines} />
				</div>
			</div>
		)
	},
}
