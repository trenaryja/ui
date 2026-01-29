import { Fieldset, TextArea } from '@/components'
import type { DemoMeta } from '@demo'

export const meta: DemoMeta = { title: 'TextArea', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo'>
			<Fieldset legend='Default' className='fieldset-flex-examples'>
				<TextArea placeholder='Type something...' />
			</Fieldset>

			<Fieldset legend='Modifiers' className='fieldset-flex-examples'>
				<div className='flex flex-col items-center gap-1'>
					<TextArea disabled placeholder='Disabled' />
				</div>
				<div className='flex flex-col items-center gap-1'>
					<TextArea readOnly defaultValue='ReadOnly' />
				</div>
			</Fieldset>

			<Fieldset legend='Styles' className='fieldset-flex-examples'>
				<div className='flex flex-col items-center gap-1'>
					<TextArea className='textarea-ghost' placeholder='Ghost style' />
				</div>
			</Fieldset>

			<Fieldset legend='Sizes' className='fieldset-flex-examples items-start'>
				<TextArea className='textarea-xs' placeholder='Extra Small' />
				<TextArea className='textarea-sm' placeholder='Small' />
				<TextArea className='textarea-md' placeholder='Medium' />
				<TextArea className='textarea-lg' placeholder='Large' />
				<TextArea className='textarea-xl' placeholder='Extra Large' />
			</Fieldset>

			<Fieldset legend='Colors' className='fieldset-flex-examples'>
				<TextArea className='textarea-primary' placeholder='Primary' />
				<TextArea className='textarea-secondary' placeholder='Secondary' />
				<TextArea className='textarea-accent' placeholder='Accent' />
				<TextArea className='textarea-neutral' placeholder='Neutral' />
				<TextArea className='textarea-info' placeholder='Info' />
				<TextArea className='textarea-success' placeholder='Success' />
				<TextArea className='textarea-warning' placeholder='Warning' />
				<TextArea className='textarea-error' placeholder='Error' />
			</Fieldset>
		</div>
	)
}
