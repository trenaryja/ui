import { Fieldset, Range } from '@/components'
import type { DemoMeta } from '@demo'

export const meta: DemoMeta = { title: 'Range', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo [&_fieldset]:w-full'>
			<Fieldset legend='Default' className='fieldset-flex-examples flex-col'>
				<Range />
			</Fieldset>

			<Fieldset legend='Modifiers' className='fieldset-flex-examples flex-col'>
				<div className='flex gap-2 items-center justify-center self-stretch'>
					<span className='font-mono'>Disabled</span>
					<Range disabled />
				</div>
				<div className='flex gap-2 items-center justify-center self-stretch'>
					<span className='font-mono'>ReadOnly</span>
					<Range readOnly />
				</div>
			</Fieldset>

			<Fieldset legend='Sizes' className='fieldset-flex-examples flex-col'>
				<Range className='range-xs' />
				<Range className='range-sm' />
				<Range className='range-md' />
				<Range className='range-lg' />
				<Range className='range-xl' />
			</Fieldset>

			<Fieldset legend='Colors' className='fieldset-flex-examples flex-col'>
				<Range className='range-primary' />
				<Range className='range-secondary' />
				<Range className='range-accent' />
				<Range className='range-neutral' />
				<Range className='range-info' />
				<Range className='range-success' />
				<Range className='range-warning' />
				<Range className='range-error' />
			</Fieldset>

			<Fieldset legend='With Datalist (stops at 33, 66, and 69)' className='fieldset-flex-examples'>
				<Range list='stops' />
				<datalist id='stops'>
					<option value={33} />
					<option value={66} />
					<option value={69} />
				</datalist>
			</Fieldset>
		</div>
	)
}
