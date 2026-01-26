import {
	Button,
	Checkbox,
	Field,
	Fieldset,
	Input,
	Radio,
	RadioGroup,
	Range,
	Select,
	TextArea,
	Toggle,
	TriToggle,
} from '@/components'
import type { DemoMeta } from '@demo/utils'
import type { FormEvent } from 'react'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'Fieldset', category: 'components' }

export function Demo() {
	const [disabled, setDisabled] = useState(false)
	const [formData, setFormData] = useState<Record<string, FormDataEntryValue> | null>(null)

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const data = new FormData(e.currentTarget)
		// Object.fromEntries works but note: duplicate keys (like unchecked checkboxes) get lost
		// For multiple values with same name, use data.getAll('name')
		setFormData(Object.fromEntries(data))
	}

	return (
		<div className='demo'>
			<Field label='Disable fieldset' labelPlacement='right-center'>
				<Toggle checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
			</Field>

			<form onSubmit={handleSubmit}>
				<Fieldset legend='All Input Types' disabled={disabled} className='w-full max-w-md'>
					<Field label='Input'>
						<Input name='input' placeholder='Text input' />
					</Field>

					<Field label='TextArea'>
						<TextArea name='textarea' placeholder='Multi-line text' />
					</Field>

					<Field label='Select'>
						<Select name='select'>
							<option value=''>Choose an option</option>
							<option value='a'>Option A</option>
							<option value='b'>Option B</option>
							<option value='c'>Option C</option>
						</Select>
					</Field>

					<Field label='Range'>
						<Range name='range' min={0} max={100} defaultValue={50} />
					</Field>

					<Field label='Checkbox'>
						<Checkbox name='checkbox' value='yes' />
					</Field>

					<Field label='Toggle'>
						<Toggle name='toggle' value='on' />
					</Field>

					<Field label='TriToggle'>
						<TriToggle name='tritoggle' />
					</Field>

					<Field label='Radio'>
						<div className='flex gap-4'>
							<Field label='Option A' labelPlacement='right-center'>
								<Radio name='radio' value='a' defaultChecked />
							</Field>
							<Field label='Option B' labelPlacement='right-center'>
								<Radio name='radio' value='b' />
							</Field>
						</div>
					</Field>

					<Field label='RadioGroup'>
						<RadioGroup name='radiogroup' options={['Small', 'Medium', 'Large']} defaultValue='Small' />
					</Field>

					<Field label='RadioGroup (btn allowDeselect)'>
						<RadioGroup name='radiogroup-btn' variant='btn' allowDeselect options={['S', 'M', 'L']} defaultValue='S' />
					</Field>

					<Button type='submit' className='btn-primary btn-block'>
						Submit
					</Button>
				</Fieldset>
			</form>

			{formData && (
				<Fieldset legend='Submitted FormData' className='w-full max-w-md'>
					<pre className='text-xs overflow-auto'>{JSON.stringify(formData, null, 2)}</pre>
				</Fieldset>
			)}
		</div>
	)
}
