import { Fieldset, Select } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'Select', category: 'components', tags: ['input'] }

const options = (
	<>
		<option value='1'>Option 1</option>
		<option value='2'>Option 2</option>
		<option value='3'>Option 3</option>
	</>
)

export function Demo() {
	return (
		<div className='demo [&_legend]:text-center'>
			<Fieldset legend='Default' className='flex justify-center'>
				<Select defaultValue='1'>{options}</Select>
			</Fieldset>

			<Fieldset legend='Modifiers' className='flex flex-wrap gap-4 justify-center'>
				<div className='flex flex-col items-center gap-1'>
					<span className='text-sm opacity-60'>Disabled</span>
					<Select disabled defaultValue='1'>
						{options}
					</Select>
				</div>
				<div className='flex flex-col items-center gap-1'>
					<span className='text-sm opacity-60'>ReadOnly</span>
					<Select readOnly defaultValue='1'>
						{options}
					</Select>
				</div>
			</Fieldset>

			<Fieldset legend='Styles' className='flex justify-center'>
				<div className='flex flex-col items-center gap-1'>
					<span className='text-sm opacity-60'>Ghost</span>
					<Select className='select-ghost' defaultValue='1'>
						{options}
					</Select>
				</div>
			</Fieldset>

			<Fieldset legend='Colors' className='flex flex-wrap gap-4 justify-center'>
				<Select className='select-primary' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-secondary' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-accent' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-neutral' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-info' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-success' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-warning' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-error' defaultValue='1'>
					{options}
				</Select>
			</Fieldset>

			<Fieldset legend='Sizes' className='flex flex-wrap gap-4 items-center justify-center'>
				<Select className='select-xs' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-sm' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-md' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-lg' defaultValue='1'>
					{options}
				</Select>
				<Select className='select-xl' defaultValue='1'>
					{options}
				</Select>
			</Fieldset>
		</div>
	)
}
