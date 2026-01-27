import { Field, Fieldset, TriToggle } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'TriToggle', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo'>
			<Fieldset legend='Default' className='fieldset-flex-examples'>
				<TriToggle />
			</Fieldset>

			<Fieldset legend='States' className='fieldset-flex-examples'>
				<Field label='Null' labelPlacement='right-center'>
					<TriToggle value={null} />
				</Field>
				<Field label='False' labelPlacement='right-center'>
					<TriToggle value={false} />
				</Field>
				<Field label='True' labelPlacement='right-center'>
					<TriToggle value />
				</Field>
			</Fieldset>

			<Fieldset legend='Modifiers' className='grid grid-cols-[auto_repeat(3,1fr)] gap-x-6 gap-y-3 items-center'>
				<div className='text-sm opacity-60'>Disabled</div>
				<TriToggle disabled value={null} className='justify-self-center' />
				<TriToggle disabled value={false} className='justify-self-center' />
				<TriToggle disabled value className='justify-self-center' />

				<div className='text-sm opacity-60'>ReadOnly</div>
				<TriToggle readOnly value={null} className='justify-self-center' />
				<TriToggle readOnly value={false} className='justify-self-center' />
				<TriToggle readOnly value className='justify-self-center' />

				<div className='text-sm opacity-60'>Required</div>
				<TriToggle required defaultValue={null} className='justify-self-center' />
				<TriToggle required defaultValue={false} className='justify-self-center' />
				<TriToggle required defaultValue className='justify-self-center' />
			</Fieldset>

			<Fieldset legend='Sizes' className='fieldset-flex-examples'>
				<TriToggle className='toggle-xs' defaultValue />
				<TriToggle className='toggle-sm' defaultValue />
				<TriToggle className='toggle-md' defaultValue />
				<TriToggle className='toggle-lg' defaultValue />
				<TriToggle className='toggle-xl' defaultValue />
			</Fieldset>

			<Fieldset legend='Colors' className='fieldset-flex-examples'>
				<TriToggle className='toggle-primary' defaultValue />
				<TriToggle className='toggle-secondary' defaultValue />
				<TriToggle className='toggle-accent' defaultValue />
				<TriToggle className='toggle-neutral' defaultValue />
				<TriToggle className='toggle-info' defaultValue />
				<TriToggle className='toggle-success' defaultValue />
				<TriToggle className='toggle-warning' defaultValue />
				<TriToggle className='toggle-error' defaultValue />
			</Fieldset>
		</div>
	)
}
