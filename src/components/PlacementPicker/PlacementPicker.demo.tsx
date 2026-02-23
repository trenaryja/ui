import { Fieldset, PlacementPicker } from '@/components'
import type { Placement } from '@/utils'
import type { DemoMeta } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'PlacementPicker', category: 'components' }

export function Demo() {
	const [placement, setPlacement] = useState<Placement | undefined>('top-center')

	return (
		<div className='demo'>
			<div className='flex flex-wrap justify-center gap-8'>
				<Fieldset legend='Default'>
					<PlacementPicker value={placement} onChange={setPlacement} />
				</Fieldset>

				<Fieldset legend='Forced (no N/A)'>
					<PlacementPicker value={placement} onChange={setPlacement} force />
				</Fieldset>

				<Fieldset legend='Custom Styled'>
					<PlacementPicker
						value={placement}
						onChange={setPlacement}
						className='gap-2'
						classNames={{ selected: 'btn-secondary' }}
					/>
				</Fieldset>
			</div>

			<div className='alert'>{placement ?? 'none'}</div>

			<div className='grid grid-cols-2 gap-4 surface surface-base-300 p-2'>
				<Fieldset legend='Vertical Placements' className='surface surface-base-200 p-4 grid-cols-2 place-items-center'>
					<div>top-start</div>
					<div>↖</div>
					<div>top-center</div>
					<div>↑</div>
					<div>top-end</div>
					<div>↗</div>
					<div>bottom-start</div>
					<div>↙</div>
					<div>bottom-center</div>
					<div>↓</div>
					<div>bottom-end</div>
					<div>↘</div>
				</Fieldset>

				<Fieldset
					legend='Horizontal Placements'
					className='surface surface-base-200 p-4 grid-cols-2 place-items-center'
				>
					<div>left-start</div>
					<div>↖</div>
					<div>left-center</div>
					<div>←</div>
					<div>left-end</div>
					<div>↙</div>
					<div>right-start</div>
					<div>↗</div>
					<div>right-center</div>
					<div>→</div>
					<div>right-end</div>
					<div>↘</div>
				</Fieldset>
			</div>
		</div>
	)
}
