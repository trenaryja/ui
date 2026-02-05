import { Field, Fieldset, Toggle } from '@/components'
import { noop } from '@/utils'
import type { DemoMeta } from '@demo'

export const meta: DemoMeta = { title: 'Toggle', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo'>
			<Fieldset legend='Default' className='fieldset-flex-examples'>
				<Toggle />
			</Fieldset>

			<Fieldset legend='States' className='fieldset-flex-examples'>
				<Field label='Off' labelPlacement='right-center'>
					<Toggle readOnly checked={false} onChange={noop} />
				</Field>
				<Field label='On' labelPlacement='right-center'>
					<Toggle readOnly checked onChange={noop} />
				</Field>
				<Field label='Indeterminate' labelPlacement='right-center'>
					<Toggle readOnly className='toggle-indeterminate' checked={false} onChange={noop} />
				</Field>
			</Fieldset>

			<Fieldset legend='Modifiers' className='grid grid-cols-[auto_repeat(3,1fr)] gap-x-6 gap-y-3 items-center'>
				<div className='text-sm opacity-60'>Disabled</div>
				<Toggle disabled checked={false} onChange={noop} className='justify-self-center' />
				<Toggle disabled checked onChange={noop} className='justify-self-center' />
				<Toggle disabled checked={false} onChange={noop} className='toggle-indeterminate justify-self-center' />

				<div className='text-sm opacity-60'>ReadOnly</div>
				<Toggle readOnly checked={false} className='justify-self-center' />
				<Toggle readOnly checked className='justify-self-center' />
				<Toggle readOnly checked={false} className='toggle-indeterminate justify-self-center' />
			</Fieldset>

			<Fieldset legend='Sizes' className='fieldset-flex-examples'>
				<Toggle className='toggle-xs' defaultChecked />
				<Toggle className='toggle-sm' defaultChecked />
				<Toggle className='toggle-md' defaultChecked />
				<Toggle className='toggle-lg' defaultChecked />
				<Toggle className='toggle-xl' defaultChecked />
			</Fieldset>

			<Fieldset legend='Colors' className='fieldset-flex-examples'>
				<Toggle className='toggle-primary' defaultChecked />
				<Toggle className='toggle-secondary' defaultChecked />
				<Toggle className='toggle-accent' defaultChecked />
				<Toggle className='toggle-neutral' defaultChecked />
				<Toggle className='toggle-info' defaultChecked />
				<Toggle className='toggle-success' defaultChecked />
				<Toggle className='toggle-warning' defaultChecked />
				<Toggle className='toggle-error' defaultChecked />
			</Fieldset>
		</div>
	)
}
