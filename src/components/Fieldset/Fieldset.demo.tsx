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
import { useState } from 'react'

export const meta: DemoMeta = { title: 'Fieldset', category: 'components' }

export function Demo() {
	const [disabled, setDisabled] = useState(false)

	return (
		<div className='demo'>
			<Field label='Disable fieldset' labelPlacement='right-center'>
				<Toggle checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
			</Field>

			<Fieldset legend='All Input Types' disabled={disabled} className='w-full max-w-md'>
				<Field label='Input'>
					<Input placeholder='Text input' />
				</Field>

				<Field label='TextArea'>
					<TextArea placeholder='Multi-line text' />
				</Field>

				<Field label='Select'>
					<Select>
						<option value=''>Choose an option</option>
						<option value='a'>Option A</option>
						<option value='b'>Option B</option>
						<option value='c'>Option C</option>
					</Select>
				</Field>

				<Field label='Range'>
					<Range min={0} max={100} defaultValue={50} />
				</Field>

				<Field label='Checkbox'>
					<Checkbox />
				</Field>

				<Field label='Toggle'>
					<Toggle />
				</Field>

				<Field label='TriToggle'>
					<TriToggle />
				</Field>

				<Field label='Radio'>
					<div className='flex gap-4'>
						<Field label='Option A' labelPlacement='right-center'>
							<Radio name='radio-example' defaultChecked />
						</Field>
						<Field label='Option B' labelPlacement='right-center'>
							<Radio name='radio-example' />
						</Field>
					</div>
				</Field>

				<Field label='RadioGroup'>
					<RadioGroup options={['Small', 'Medium', 'Large']} defaultValue='Small' />
				</Field>

				<Field label='RadioGroup (btn)'>
					<RadioGroup variant='btn' options={['S', 'M', 'L']} defaultValue='S' />
				</Field>

				<Button type='submit' className='btn-primary btn-block'>
					Submit
				</Button>
			</Fieldset>
		</div>
	)
}
