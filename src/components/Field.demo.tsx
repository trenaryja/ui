import { Field, PlacementPicker, Select } from '@/components'
import type { ControlName } from '@/stories/utils'
import { controlMeta } from '@/stories/utils'
import type { Placement } from '@/utils'
import type { DemoMeta } from '@demo/utils'
import { useState } from 'react'
import * as R from 'remeda'

export const meta: DemoMeta = { title: 'Field', category: 'components' }

export const Demo = () => {
	const [labelPlacement, setLabelPlacement] = useState<Placement | undefined>('top-start')
	const [hintPlacement, setHintPlacement] = useState<Placement | undefined>('bottom-start')
	const [errorPlacement, setErrorPlacement] = useState<Placement | undefined>('bottom-end')
	const [control, setControl] = useState<ControlName>('input')

	return (
		<div className='demo'>
			<Select value={control} onChange={(e) => setControl(e.target.value as ControlName)}>
				{R.keys(controlMeta).map((key) => (
					<option key={key} value={key}>
						{key}
					</option>
				))}
			</Select>

			<div className='flex flex-wrap gap-4 justify-center'>
				<Field labelPlacement='top-center' label='Label' classNames={{ label: 'font-bold' }}>
					<PlacementPicker value={labelPlacement} onChange={setLabelPlacement} />
				</Field>
				<Field labelPlacement='top-center' label='Hint' classNames={{ label: 'font-bold' }}>
					<PlacementPicker value={hintPlacement} onChange={setHintPlacement} />
				</Field>
				<Field labelPlacement='top-center' label='Error' classNames={{ label: 'font-bold' }}>
					<PlacementPicker value={errorPlacement} onChange={setErrorPlacement} />
				</Field>
			</div>

			<Field
				label={labelPlacement ? 'Label' : undefined}
				labelPlacement={labelPlacement}
				hint={hintPlacement ? 'Hint message' : undefined}
				hintPlacement={hintPlacement}
				error={errorPlacement ? 'Error message' : undefined}
				errorPlacement={errorPlacement}
			>
				{controlMeta[control]}
			</Field>
		</div>
	)
}
