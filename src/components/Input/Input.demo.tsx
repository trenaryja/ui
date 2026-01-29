import { Fieldset, Input } from '@/components'
import type { DemoMeta } from '@demo'

export const meta: DemoMeta = { title: 'Input', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo'>
			<Fieldset legend='Default' className='fieldset-flex-examples'>
				<Input placeholder='Type something...' />
			</Fieldset>

			<Fieldset legend='Modifiers' className='fieldset-flex-examples'>
				<Input placeholder='Disabled' disabled />
				<Input placeholder='ReadOnly' readOnly defaultValue='ReadOnly' />
			</Fieldset>

			<Fieldset legend='Styles' className='fieldset-flex-examples'>
				<Input placeholder='Ghost' className='input-ghost' />
			</Fieldset>

			<Fieldset legend='Sizes' className='fieldset-flex-examples'>
				<Input placeholder='Extra Small' className='input-xs' />
				<Input placeholder='Small' className='input-sm' />
				<Input placeholder='Medium' className='input-md' />
				<Input placeholder='Large' className='input-lg' />
				<Input placeholder='Extra Large' className='input-xl' />
			</Fieldset>

			<Fieldset legend='Colors' className='fieldset-flex-examples'>
				<Input placeholder='Primary' className='input-primary' />
				<Input placeholder='Secondary' className='input-secondary' />
				<Input placeholder='Accent' className='input-accent' />
				<Input placeholder='Neutral' className='input-neutral' />
				<Input placeholder='Info' className='input-info' />
				<Input placeholder='Success' className='input-success' />
				<Input placeholder='Warning' className='input-warning' />
				<Input placeholder='Error' className='input-error' />
			</Fieldset>

			<Fieldset legend='With Datalist' className='fieldset-flex-examples'>
				<Input list='browsers' placeholder='Choose a browser' />
				<datalist id='browsers'>
					<option value='Chrome' />
					<option value='Firefox' />
					<option value='Safari' />
					<option value='Edge' />
					<option value='Opera' />
				</datalist>
			</Fieldset>
		</div>
	)
}
