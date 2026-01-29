import { ScaledText, TextArea } from '@/components'
import type { DemoMeta } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'ScaledText', category: 'components' }

export const Demo = () => {
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
}
