import { Checkbox, Field, Fieldset, Input, RadioGroup, Range, Select, Textarea, Toggle } from '@/components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const meta = { title: 'other/Form' } satisfies Meta
export default meta

export const Default: StoryObj = {
	name: 'Form',
	// eslint-disable-next-line complexity
	render: () => {
		const [showErrors, setShowErrors] = useState(false)
		const [showHints, setShowHints] = useState(false)
		const [showLabels, setShowLabels] = useState(true)
		const [disableAll, setDisableAll] = useState(false)
		const [readOnlyAll, setReadOnlyAll] = useState(false)

		return (
			<div className='demo'>
				<Fieldset className='flex flex-wrap w-full justify-between gap-4'>
					<Field label='Show Labels'>
						<Checkbox checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
					</Field>
					<Field label='Show Hints'>
						<Checkbox checked={showHints} onChange={(e) => setShowHints(e.target.checked)} />
					</Field>
					<Field label='Show Errors'>
						<Checkbox checked={showErrors} onChange={(e) => setShowErrors(e.target.checked)} />
					</Field>
					<Field label='Disable All'>
						<Checkbox checked={disableAll} onChange={(e) => setDisableAll(e.target.checked)} />
					</Field>
					<Field label='Read-only All'>
						<Checkbox checked={readOnlyAll} onChange={(e) => setReadOnlyAll(e.target.checked)} />
					</Field>
				</Fieldset>

				<div>
					<Fieldset disabled={disableAll} className='gap-4'>
						<Field
							label={showLabels ? 'Input Field' : undefined}
							hint={showHints ? 'Type something here' : undefined}
							error={showErrors ? 'This field is required' : undefined}
						>
							<Input placeholder='Enter text...' readOnly={readOnlyAll} />
						</Field>
						<Field
							label={showLabels ? 'Textarea' : undefined}
							hint={showHints ? 'Longer text input' : undefined}
							error={showErrors ? 'Please provide more details' : undefined}
						>
							<Textarea placeholder='Enter multiple lines...' readOnly={readOnlyAll} />
						</Field>
						<Field
							label={showLabels ? 'Select' : undefined}
							hint={showHints ? 'Choose an option' : undefined}
							error={showErrors ? 'Please select a value' : undefined}
						>
							<Select readOnly={readOnlyAll}>
								<option value='' disabled>
									Select an option...
								</option>
								<option value='option1'>Option 1</option>
								<option value='option2'>Option 2</option>
								<option value='option3'>Option 3</option>
							</Select>
						</Field>
						<Field
							label={showLabels ? 'Range Slider' : undefined}
							hint={showHints ? 'Slide to a value' : undefined}
							error={showErrors ? 'Value must be between 0 and 100' : undefined}
						>
							<Range readOnly={readOnlyAll} />
						</Field>
						<Field
							label={showLabels ? 'Checkbox' : undefined}
							hint={showHints ? 'Check to agree' : undefined}
							error={showErrors ? 'You must agree to continue' : undefined}
						>
							<Checkbox readOnly={readOnlyAll} />
						</Field>
						<Field
							label={showLabels ? 'Toggle' : undefined}
							hint={showHints ? 'Toggle to enable' : undefined}
							error={showErrors ? 'This setting is required' : undefined}
						>
							<Toggle readOnly={readOnlyAll} />
						</Field>
						<Field
							label={showLabels ? 'Radio Group' : undefined}
							hint={showHints ? 'Select one option' : undefined}
							error={showErrors ? 'Please make a selection' : undefined}
						>
							<RadioGroup readOnly={readOnlyAll} options={['First', 'Second', 'Third']} />
						</Field>
					</Fieldset>
				</div>
			</div>
		)
	},
}

// TODO: use utils for rendering all controls
// TODO: global options, per-field options
// TODO: get rid of eslint-disable line
// TODO: show subgrid capability to align labels
