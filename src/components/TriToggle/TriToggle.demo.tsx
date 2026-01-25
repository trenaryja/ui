import type { TriToggleValue } from '@/components'
import { Field, Fieldset, TriToggle } from '@/components'
import { boolMap } from '@/utils'
import type { DemoMeta } from '@demo/utils'
import { useState } from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'

export const meta: DemoMeta = { title: 'TriToggle', category: 'components' }

export function Demo() {
	const [visitedBefore, setVisitedBefore] = useState<TriToggleValue>(null)

	return (
		<div className='demo'>
			<TriToggle />

			<div className='flex flex-wrap gap-6'>
				<Field label='null' labelPlacement='right-center'>
					<TriToggle value={null} />
				</Field>

				<Field label='false' labelPlacement='right-center'>
					<TriToggle value={false} />
				</Field>

				<Field label='true' labelPlacement='right-center'>
					<TriToggle value />
				</Field>

				<Field label='disabled' labelPlacement='right-center'>
					<TriToggle value={null} disabled />
				</Field>
			</div>

			<hr className='w-full opacity-25' />

			<Fieldset legend='Basic Usage' className='w-full max-w-sm'>
				<Field label='Have you been here before?'>
					<div className='flex items-center gap-2'>
						<TriToggle value={visitedBefore} onChange={setVisitedBefore} />
						<span>{boolMap(visitedBefore, ['Yes', 'No', 'Not Sure'])}</span>
					</div>
				</Field>
			</Fieldset>

			<Fieldset
				legend={
					<span className='flex items-center gap-1'>
						Required
						<span
							className='tooltip tooltip-right'
							data-tip='Once interacted with, the toggle cannot return to the indeterminate state'
						>
							<IoInformationCircleOutline className='text-base opacity-50' />
						</span>
					</span>
				}
				className='w-full max-w-sm'
			>
				<Field label='Do you have any food allergies?'>
					<div className='flex items-center gap-2'>
						<TriToggle required />
					</div>
				</Field>
			</Fieldset>
		</div>
	)
}
