import { Field, Fieldset, Toggle } from '@/components'
import { useUnsavedChangesPrompt } from '@/hooks'
import type { DemoMeta } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'useUnsavedChangesPrompt', category: 'hooks' }

export const Demo = () => {
	const [isDirty, setIsDirty] = useState(true)

	useUnsavedChangesPrompt(isDirty)

	return (
		<div className='demo place-items-center'>
			<Fieldset className='grid gap-4 w-full place-items-center'>
				<Field label='pretend there are unsaved changes' labelPlacement='right-center'>
					<Toggle checked={isDirty} onChange={(e) => setIsDirty(e.target.checked)} />
				</Field>

				<div className='alert alert-soft'>Try refreshing the page, closing the tab, or navigating away</div>
			</Fieldset>
		</div>
	)
}
