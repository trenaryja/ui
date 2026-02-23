import { Field, Fieldset, Radio } from '@/components'
import { noop } from '@/utils'
import type { DemoMeta } from '@demo'

export const meta: DemoMeta = { title: 'Radio', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo'>
			<Fieldset legend='Default' className='fieldset-flex-examples'>
				<Radio name='default' />
				<Radio name='default' />
			</Fieldset>

			<Fieldset legend='States' className='fieldset-flex-examples'>
				<Field label='Unchecked' labelPlacement='right-center'>
					<Radio readOnly checked={false} onChange={noop} />
				</Field>
				<Field label='Checked' labelPlacement='right-center'>
					<Radio readOnly checked onChange={noop} />
				</Field>
			</Fieldset>

			<Fieldset legend='Modifiers' className='fieldset-flex-examples'>
				<div className='grid grid-cols-[auto_repeat(2,1fr)] gap-2 items-center'>
					<div className='text-sm opacity-60'>Disabled</div>
					<Radio disabled checked={false} onChange={noop} className='justify-self-center' />
					<Radio disabled checked onChange={noop} className='justify-self-center' />

					<div className='text-sm opacity-60'>ReadOnly</div>
					<Radio readOnly checked={false} className='justify-self-center' />
					<Radio readOnly checked className='justify-self-center' />
				</div>
			</Fieldset>

			<Fieldset legend='Sizes' className='fieldset-flex-examples'>
				<Radio name='sizes' className='radio-xs' />
				<Radio name='sizes' className='radio-sm' />
				<Radio name='sizes' className='radio-md' defaultChecked />
				<Radio name='sizes' className='radio-lg' />
				<Radio name='sizes' className='radio-xl' />
			</Fieldset>

			<Fieldset legend='Colors' className='fieldset-flex-examples gap-6'>
				<div className='flex flex-col gap-1'>
					<Radio name='primary' className='radio-primary' defaultChecked />
					<Radio name='primary' className='radio-primary' />
				</div>
				<div className='flex flex-col gap-1'>
					<Radio name='secondary' className='radio-secondary' defaultChecked />
					<Radio name='secondary' className='radio-secondary' />
				</div>
				<div className='flex flex-col gap-1'>
					<Radio name='accent' className='radio-accent' defaultChecked />
					<Radio name='accent' className='radio-accent' />
				</div>
				<div className='flex flex-col gap-1'>
					<Radio name='neutral' className='radio-neutral' defaultChecked />
					<Radio name='neutral' className='radio-neutral' />
				</div>
				<div className='flex flex-col gap-1'>
					<Radio name='info' className='radio-info' defaultChecked />
					<Radio name='info' className='radio-info' />
				</div>
				<div className='flex flex-col gap-1'>
					<Radio name='success' className='radio-success' defaultChecked />
					<Radio name='success' className='radio-success' />
				</div>
				<div className='flex flex-col gap-1'>
					<Radio name='warning' className='radio-warning' defaultChecked />
					<Radio name='warning' className='radio-warning' />
				</div>
				<div className='flex flex-col gap-1'>
					<Radio name='error' className='radio-error' defaultChecked />
					<Radio name='error' className='radio-error' />
				</div>
			</Fieldset>

			<Fieldset legend='Button Variant' className='fieldset-flex-examples'>
				<Radio variant='btn' name='btn-variant' aria-label='Small' defaultChecked />
				<Radio variant='btn' name='btn-variant' aria-label='Medium' />
				<Radio variant='btn' name='btn-variant' aria-label='Large' />
			</Fieldset>

			<Fieldset legend='Button Variant (Join)' className='fieldset-flex-examples'>
				<div className='join'>
					<Radio variant='btn' name='btn-join' aria-label='Small' className='join-item' defaultChecked />
					<Radio variant='btn' name='btn-join' aria-label='Medium' className='join-item' />
					<Radio variant='btn' name='btn-join' aria-label='Large' className='join-item' />
				</div>
			</Fieldset>
		</div>
	)
}
