'use client'

import { Button, Field, Fieldset, Toggle } from '@/components'
import { useNativeDialog } from '@/hooks'
import type { DemoMeta } from '@demo'
import { useId, useState } from 'react'

export const meta: DemoMeta = { title: 'useNativeDialog', category: 'hooks' }

export const Demo = () => {
	const dialogId = useId()
	const [open, setOpen] = useState(false)
	const [hasEscapeKey, setHasEscapeKey] = useState(true)
	const [hasOutsideClick, setHasOutsideClick] = useState(true)

	const { openNative, closeNative, onCancel, onClose } = useNativeDialog({ dialogId, hasEscapeKey, open, setOpen })

	return (
		<div className='demo place-items-center'>
			<Fieldset legend='Options' className='grid gap-2'>
				<Field label='Close on Escape key' labelPlacement='right-center'>
					<Toggle checked={hasEscapeKey} onChange={(e) => setHasEscapeKey(e.target.checked)} />
				</Field>
				<Field label='Close on outside click' labelPlacement='right-center'>
					<Toggle checked={hasOutsideClick} onChange={(e) => setHasOutsideClick(e.target.checked)} />
				</Field>
			</Fieldset>

			<Fieldset legend='Open via state' className='flex gap-2 justify-center'>
				<Button onClick={() => setOpen(true)}>setOpen(true)</Button>
			</Fieldset>

			<Fieldset legend='Open via openNative()' className='flex gap-2 justify-center'>
				<Button onClick={openNative}>openNative()</Button>
			</Fieldset>

			<dialog id={dialogId} className='m-auto p-4' onCancel={onCancel} onClose={onClose}>
				<div className='grid gap-4 min-w-64'>
					<h3 className='font-bold text-lg'>Native {'<dialog>'}</h3>
					<p className='text-sm opacity-70'>
						{[hasEscapeKey && 'Press Escape', hasOutsideClick && 'click outside', 'use a button below']
							.filter(Boolean)
							.join(', or ')}
						.
					</p>
					<div className='flex gap-2 flex-wrap'>
						<Button onClick={() => setOpen(false)}>setOpen(false)</Button>
						<Button onClick={closeNative}>closeNative()</Button>
					</div>
				</div>

				{hasOutsideClick && (
					<form method='dialog' className='fixed inset-0 -z-10'>
						<button type='submit' className='size-full cursor-default' aria-label='Close' />
					</form>
				)}
			</dialog>
		</div>
	)
}
