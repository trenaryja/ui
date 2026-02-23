import { BalancedGrid, Field, Fieldset, Range, Toggle } from '@/components'
import type { DemoMeta } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'BalancedGrid', category: 'components' }

export const Demo = () => {
	const [itemCount, setItemCount] = useState(7)
	const [maxCols, setMaxCols] = useState(3)
	const [pack, setPack] = useState(false)

	return (
		<div className='demo'>
			<Fieldset className='max-w-xs size-full'>
				<Field label='Pack last row'>
					<Toggle checked={pack} onChange={(e) => setPack(e.target.checked)} />
				</Field>
				<Field label={`Item count: ${itemCount}`}>
					<Range max={25} min={1} value={itemCount} onChange={(e) => setItemCount(e.target.valueAsNumber)} />
				</Field>
				<Field label={`Max # of columns: ${maxCols}`}>
					<Range max={10} min={1} value={maxCols} onChange={(e) => setMaxCols(e.target.valueAsNumber)} />
				</Field>
			</Fieldset>
			<BalancedGrid className='gap-2 place-items-center w-full' pack={pack} maxCols={maxCols}>
				{[...Array(itemCount).keys()].map((i) => (
					<div className='surface grid place-items-center h-20 w-full' key={i}>
						{i + 1}
					</div>
				))}
			</BalancedGrid>
		</div>
	)
}
