import { Field, Fieldset, RadioGroup } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'RadioGroup', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo [&_legend]:text-center'>
			<Fieldset legend='String Options' className='flex justify-center'>
				<RadioGroup options={['Small', 'Medium', 'Large']} defaultValue='Small' />
			</Fieldset>

			<Fieldset legend='Object Options' className='flex justify-center'>
				<RadioGroup
					options={[
						{ value: 'sm', label: 'Small' },
						{ value: 'md', label: 'Medium' },
						{ value: 'lg', label: 'Large' },
					]}
					defaultValue='sm'
				/>
			</Fieldset>

			<Fieldset legend='Disabled Option' className='flex justify-center'>
				<RadioGroup
					options={[
						{ value: 'free', label: 'Free' },
						{ value: 'pro', label: 'Pro' },
						{ value: 'enterprise', label: 'Enterprise', disabled: true },
					]}
					defaultValue='free'
				/>
			</Fieldset>

			<Fieldset legend='Disabled Group' className='flex justify-center'>
				<RadioGroup options={['Yes', 'No', 'Maybe']} defaultValue='Yes' disabled />
			</Fieldset>

			<Fieldset legend='ReadOnly' className='flex justify-center'>
				<RadioGroup options={['Yes', 'No', 'Maybe']} defaultValue='Yes' readOnly />
			</Fieldset>

			<Fieldset legend='With Field' className='flex justify-center'>
				<Field label='Priority'>
					<RadioGroup options={['Low', 'Medium', 'High']} defaultValue='Low' />
				</Field>
			</Fieldset>

			<Fieldset legend='Button Variant' className='flex justify-center'>
				<RadioGroup variant='btn' options={['Small', 'Medium', 'Large']} defaultValue='Small' />
			</Fieldset>

			<Fieldset legend='Button Variant (Join)' className='flex justify-center'>
				<RadioGroup
					variant='btn'
					options={['Small', 'Medium', 'Large']}
					defaultValue='Small'
					classNames={{ container: 'join', item: 'join-item' }}
				/>
			</Fieldset>
		</div>
	)
}
