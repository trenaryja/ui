import { Fieldset, TextArea } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'TextArea', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo [&_legend]:text-center'>
			<Fieldset legend='Default' className='flex justify-center'>
				<TextArea placeholder='Type something...' />
			</Fieldset>

			<Fieldset legend='Modifiers' className='flex flex-wrap gap-4 justify-center'>
				<div className='flex flex-col items-center gap-1'>
					<TextArea disabled placeholder='Disabled' />
				</div>
				<div className='flex flex-col items-center gap-1'>
					<TextArea readOnly defaultValue='ReadOnly' />
				</div>
			</Fieldset>

			<Fieldset legend='Styles' className='flex justify-center'>
				<div className='flex flex-col items-center gap-1'>
					<TextArea className='textarea-ghost' placeholder='Ghost style' />
				</div>
			</Fieldset>

			<Fieldset legend='Colors' className='flex flex-wrap gap-4 justify-center'>
				<TextArea className='textarea-primary' placeholder='Primary' />
				<TextArea className='textarea-secondary' placeholder='Secondary' />
				<TextArea className='textarea-accent' placeholder='Accent' />
				<TextArea className='textarea-neutral' placeholder='Neutral' />
				<TextArea className='textarea-info' placeholder='Info' />
				<TextArea className='textarea-success' placeholder='Success' />
				<TextArea className='textarea-warning' placeholder='Warning' />
				<TextArea className='textarea-error' placeholder='Error' />
			</Fieldset>

			<Fieldset legend='Sizes' className='flex flex-wrap gap-4 items-start justify-center'>
				<TextArea className='textarea-xs' placeholder='Extra Small' />
				<TextArea className='textarea-sm' placeholder='Small' />
				<TextArea className='textarea-md' placeholder='Medium' />
				<TextArea className='textarea-lg' placeholder='Large' />
				<TextArea className='textarea-xl' placeholder='Extra Large' />
			</Fieldset>
		</div>
	)
}
