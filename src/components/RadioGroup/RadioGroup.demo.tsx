import { Field, Fieldset, RadioGroup, Toggle } from '@/components'
import type { DemoMeta } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'RadioGroup', category: 'components', tags: ['input'] }

const options = ['Small', 'Medium', 'Large']

export function Demo() {
	const [allowDeselect, setAllowDeselect] = useState(false)

	return (
		<div className='demo'>
			<Fieldset>
				<Field label='Allow Deselect' labelPlacement='right-center'>
					<Toggle checked={allowDeselect} onChange={(e) => setAllowDeselect(e.target.checked)} />
				</Field>
			</Fieldset>

			<Field label='Default'>
				<RadioGroup options={options} defaultValue='Small' allowDeselect={allowDeselect} />
			</Field>

			<Field label='Disabled Option'>
				<RadioGroup
					options={options.map((o) => (o === 'Large' ? { value: o, label: o, disabled: true } : o))}
					defaultValue='Small'
					allowDeselect={allowDeselect}
				/>
			</Field>

			<Field label='Disabled Group'>
				<RadioGroup options={options} defaultValue='Small' disabled allowDeselect={allowDeselect} />
			</Field>

			<Field label='ReadOnly'>
				<RadioGroup options={options} defaultValue='Small' readOnly allowDeselect={allowDeselect} />
			</Field>

			<Field label='Button Variant'>
				<RadioGroup variant='btn' options={options} defaultValue='Small' allowDeselect={allowDeselect} />
			</Field>

			<Field label='Button Variant (Join)'>
				<RadioGroup
					variant='btn'
					options={options}
					defaultValue='Small'
					allowDeselect={allowDeselect}
					classNames={{ container: 'join', item: 'join-item' }}
				/>
			</Field>
		</div>
	)
}
