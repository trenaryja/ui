import { Field, Fieldset, RadioGroup } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'RadioGroup', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo'>
			<Fieldset legend='String Options' className='fieldset-flex-examples'>
				<RadioGroup options={['Small', 'Medium', 'Large']} defaultValue='Small' />
			</Fieldset>

			<Fieldset legend='Object Options' className='fieldset-flex-examples'>
				<RadioGroup
					options={[
						{ value: 'sm', label: 'Small' },
						{ value: 'md', label: 'Medium' },
						{ value: 'lg', label: 'Large' },
					]}
					defaultValue='sm'
				/>
			</Fieldset>

			<Fieldset legend='Disabled Option' className='fieldset-flex-examples'>
				<RadioGroup
					options={[
						{ value: 'free', label: 'Free' },
						{ value: 'pro', label: 'Pro' },
						{ value: 'enterprise', label: 'Enterprise', disabled: true },
					]}
					defaultValue='free'
				/>
			</Fieldset>

			<Fieldset legend='Disabled Group' className='fieldset-flex-examples'>
				<RadioGroup options={['Yes', 'No', 'Maybe']} defaultValue='Yes' disabled />
			</Fieldset>

			<Fieldset legend='ReadOnly' className='fieldset-flex-examples'>
				<RadioGroup options={['Yes', 'No', 'Maybe']} defaultValue='Yes' readOnly />
			</Fieldset>

			<Fieldset legend='With Field' className='fieldset-flex-examples'>
				<Field label='Priority'>
					<RadioGroup options={['Low', 'Medium', 'High']} defaultValue='Low' />
				</Field>
			</Fieldset>

			<Fieldset legend='Button Variant' className='fieldset-flex-examples'>
				<RadioGroup variant='btn' options={['Small', 'Medium', 'Large']} defaultValue='Small' />
			</Fieldset>

			<Fieldset legend='Button Variant (Join)' className='fieldset-flex-examples'>
				<RadioGroup
					variant='btn'
					options={['Small', 'Medium', 'Large']}
					defaultValue='Small'
					classNames={{ container: 'join', item: 'join-item' }}
				/>
			</Fieldset>

			<Fieldset legend='Allow Deselect' className='fieldset-flex-examples'>
				<RadioGroup options={['Yes', 'No', 'Maybe']} defaultValue='Yes' allowDeselect />
			</Fieldset>

			<Fieldset legend='Allow Deselect (btn)' className='fieldset-flex-examples'>
				<RadioGroup variant='btn' options={['S', 'M', 'L']} defaultValue='S' allowDeselect />
			</Fieldset>
		</div>
	)
}
