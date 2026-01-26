import { Fieldset, Range } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'Range', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo [&_legend]:text-center'>
			<Fieldset legend='Default' className='flex justify-center'>
				<Range className='w-full max-w-xs' />
			</Fieldset>

			<Fieldset legend='Modifiers' className='flex flex-col gap-4 items-center'>
				<div className='flex items-center gap-4 w-full max-w-xs'>
					<span className='text-sm opacity-60 w-20'>Disabled</span>
					<Range disabled defaultValue={50} className='flex-1' />
				</div>
				<div className='flex items-center gap-4 w-full max-w-xs'>
					<span className='text-sm opacity-60 w-20'>ReadOnly</span>
					<Range readOnly defaultValue={50} className='flex-1' />
				</div>
			</Fieldset>

			<Fieldset legend='Colors' className='flex flex-col gap-2 items-center'>
				<Range className='range-primary w-full max-w-xs' defaultValue={40} />
				<Range className='range-secondary w-full max-w-xs' defaultValue={40} />
				<Range className='range-accent w-full max-w-xs' defaultValue={40} />
				<Range className='range-neutral w-full max-w-xs' defaultValue={40} />
				<Range className='range-info w-full max-w-xs' defaultValue={40} />
				<Range className='range-success w-full max-w-xs' defaultValue={40} />
				<Range className='range-warning w-full max-w-xs' defaultValue={40} />
				<Range className='range-error w-full max-w-xs' defaultValue={40} />
			</Fieldset>

			<Fieldset legend='Sizes' className='flex flex-col gap-2 items-center'>
				<Range className='range-xs w-full max-w-xs' defaultValue={40} />
				<Range className='range-sm w-full max-w-xs' defaultValue={40} />
				<Range className='range-md w-full max-w-xs' defaultValue={40} />
				<Range className='range-lg w-full max-w-xs' defaultValue={40} />
				<Range className='range-xl w-full max-w-xs' defaultValue={40} />
			</Fieldset>
		</div>
	)
}
