import { Checkbox, Field, Fieldset } from '@/components'
import type { DemoMeta } from '@demo'

export const meta: DemoMeta = { title: 'Checkbox', category: 'components', tags: ['input'] }

const noop = () => undefined

export function Demo() {
	return (
		<div className='demo'>
			<Fieldset legend='Default' className='fieldset-flex-examples'>
				<Checkbox />
			</Fieldset>

			<Fieldset legend='States' className='fieldset-flex-examples'>
				<Field label='Unchecked' labelPlacement='right-center'>
					<Checkbox checked={false} onChange={noop} />
				</Field>
				<Field label='Checked' labelPlacement='right-center'>
					<Checkbox checked onChange={noop} />
				</Field>
				<Field label='Indeterminate' labelPlacement='right-center'>
					<Checkbox className='checkbox-indeterminate' checked={false} onChange={noop} />
				</Field>
			</Fieldset>

			<Fieldset legend='Modifiers' className='grid grid-cols-[auto_repeat(3,1fr)] gap-x-6 gap-y-3 items-center'>
				<div className='text-sm opacity-60'>Disabled</div>
				<Checkbox disabled checked={false} onChange={noop} className='justify-self-center' />
				<Checkbox disabled checked onChange={noop} className='justify-self-center' />
				<Checkbox disabled checked={false} onChange={noop} className='checkbox-indeterminate justify-self-center' />

				{/* ReadOnly row */}
				<div className='text-sm opacity-60'>ReadOnly</div>
				<Checkbox readOnly checked={false} className='justify-self-center' />
				<Checkbox readOnly checked className='justify-self-center' />
				<Checkbox readOnly checked={false} className='checkbox-indeterminate justify-self-center' />
			</Fieldset>

			<Fieldset legend='Sizes' className='fieldset-flex-examples'>
				<Checkbox className='checkbox-xs' defaultChecked />
				<Checkbox className='checkbox-sm' defaultChecked />
				<Checkbox className='checkbox-md' defaultChecked />
				<Checkbox className='checkbox-lg' defaultChecked />
				<Checkbox className='checkbox-xl' defaultChecked />
			</Fieldset>

			<Fieldset legend='Colors' className='fieldset-flex-examples'>
				<Checkbox className='checkbox-primary' defaultChecked />
				<Checkbox className='checkbox-secondary' defaultChecked />
				<Checkbox className='checkbox-accent' defaultChecked />
				<Checkbox className='checkbox-neutral' defaultChecked />
				<Checkbox className='checkbox-info' defaultChecked />
				<Checkbox className='checkbox-success' defaultChecked />
				<Checkbox className='checkbox-warning' defaultChecked />
				<Checkbox className='checkbox-error' defaultChecked />
			</Fieldset>
		</div>
	)
}
