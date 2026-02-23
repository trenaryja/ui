import { Button, Field, Fieldset, PlacementPicker, RadioGroup, Toggle } from '@/components'
import type { PopoverPosition } from '@/hooks'
import { useNativePopover } from '@/hooks'
import type { Placement } from '@/utils'
import type { DemoMeta } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'useNativePopover', category: 'hooks' }

const toPopoverPosition = (p: Placement) => p.replace('-', ' ') as PopoverPosition
const toPlacement = (p: PopoverPosition) => (p === 'center' ? undefined : (p.replace(' ', '-') as Placement))

export const Demo = () => {
	const [position, setPosition] = useState<PopoverPosition>('bottom center')
	const [mode, setMode] = useState<'auto' | 'manual'>('auto')
	const [action, setAction] = useState<'hide' | 'show' | 'toggle'>('toggle')
	const { triggerProps, contentProps, close, open } = useNativePopover({ position, mode, action })

	return (
		<div className='demo'>
			<Fieldset>
				<Field label='Position'>
					<PlacementPicker
						value={toPlacement(position)}
						onChange={(p) => setPosition(p ? toPopoverPosition(p) : 'center')}
					/>
				</Field>
				<Field label='Manual mode' labelPlacement='right-center'>
					<Toggle checked={mode === 'manual'} onChange={(e) => setMode(e.target.checked ? 'manual' : 'auto')} />
				</Field>
				<Field label='Action'>
					<RadioGroup
						options={['toggle', 'show', 'hide']}
						value={action}
						onChange={(e) => setAction(e.target.value as typeof action)}
					/>
				</Field>
			</Fieldset>

			<div className='grid place-items-center h-64'>
				<div className='flex gap-2'>
					<Button {...triggerProps}>
						{action === 'toggle' ? 'Toggle' : action === 'show' ? 'Open' : 'Close'} Popover
					</Button>
					{action !== 'toggle' && (
						<Button className='btn-ghost' onClick={action === 'show' ? close : open}>
							{action === 'show' ? 'Close' : 'Open'}
						</Button>
					)}
				</div>
				<div
					{...contentProps}
					className='m-1 p-4 border border-current/25 rounded-box bg-transparent text-base-content backdrop-blur'
				>
					<div className='grid place-items-center gap-4'>
						<p>Hello World</p>
						{mode === 'manual' && <Button onClick={close}>Close</Button>}
					</div>
				</div>
			</div>
		</div>
	)
}
