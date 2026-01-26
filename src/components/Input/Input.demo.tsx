import { Fieldset, Input } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'Input', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo [&_legend]:text-center'>
			<Fieldset legend='States' className='flex flex-wrap justify-center gap-4 items-center'>
				<Input placeholder='Default' />
				<Input placeholder='Disabled' disabled />
				<Input placeholder='ReadOnly' readOnly defaultValue='ReadOnly' />
			</Fieldset>

			<Fieldset legend='Styles' className='flex flex-wrap justify-center gap-4 items-center'>
				<Input placeholder='Default' />
				<Input placeholder='Ghost' className='input-ghost' />
			</Fieldset>

			<Fieldset legend='Colors' className='flex flex-wrap justify-center gap-4 items-center'>
				<Input placeholder='Neutral' className='input-neutral' />
				<Input placeholder='Primary' className='input-primary' />
				<Input placeholder='Secondary' className='input-secondary' />
				<Input placeholder='Accent' className='input-accent' />
				<Input placeholder='Info' className='input-info' />
				<Input placeholder='Success' className='input-success' />
				<Input placeholder='Warning' className='input-warning' />
				<Input placeholder='Error' className='input-error' />
			</Fieldset>

			<Fieldset legend='Sizes' className='flex flex-wrap justify-center gap-4 items-center'>
				<Input placeholder='Extra Small' className='input-xs' />
				<Input placeholder='Small' className='input-sm' />
				<Input placeholder='Medium' className='input-md' />
				<Input placeholder='Large' className='input-lg' />
				<Input placeholder='Extra Large' className='input-xl' />
			</Fieldset>

			<Fieldset legend='With Datalist' className='flex flex-wrap justify-center gap-4 items-center'>
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
