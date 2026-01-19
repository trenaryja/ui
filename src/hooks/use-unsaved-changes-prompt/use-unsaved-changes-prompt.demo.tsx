import { useUnsavedChangesPrompt } from '@/hooks'
import type { DemoMeta } from '@demo/utils'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'useUnsavedChangesPrompt', category: 'hooks' }

export const Demo = () => {
	const [isDirty, setIsDirty] = useState(true)

	useUnsavedChangesPrompt(isDirty)

	return (
		<div className='demo place-items-center'>
			<fieldset className='grid gap-4 w-full place-items-center'>
				<label className='flex items-center gap-2'>
					<input checked={isDirty} className='toggle' type='checkbox' onChange={(e) => setIsDirty(e.target.checked)} />
					<span className='text-sm'>pretend there are unsaved changes</span>
				</label>

				<div className='alert alert-soft'>Try refreshing the page, closing the tab, or navigating away</div>
			</fieldset>
		</div>
	)
}
