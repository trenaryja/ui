import { Fieldset, Range } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'Range', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo [&_legend]:text-center [&_fieldset]:w-full'>
			<Fieldset legend='Default' className='flex flex-col gap-2 items-center'>
				<Range />
			</Fieldset>

			<Fieldset legend='Modifiers' className='flex flex-col gap-4 items-center w-full'>
				<div className='flex items-center gap-4'>
					<span className='text-sm opacity-60 w-20'>Disabled</span>
					<Range disabled className='flex-1' />
				</div>
				<div className='flex items-center gap-4'>
					<span className='text-sm opacity-60 w-20'>ReadOnly</span>
					<Range readOnly className='flex-1' />
				</div>
			</Fieldset>

			<Fieldset legend='Colors' className='flex flex-col gap-2 items-center'>
				<Range className='range-primary' />
				<Range className='range-secondary' />
				<Range className='range-accent' />
				<Range className='range-neutral' />
				<Range className='range-info' />
				<Range className='range-success' />
				<Range className='range-warning' />
				<Range className='range-error' />
			</Fieldset>

			<Fieldset legend='Sizes' className='flex flex-col gap-2 items-center'>
				<Range className='range-xs' />
				<Range className='range-sm' />
				<Range className='range-md' />
				<Range className='range-lg' />
				<Range className='range-xl' />
			</Fieldset>

			<Fieldset legend='With Datalist (stops at 33, 66, and 69)' className='flex justify-center'>
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
