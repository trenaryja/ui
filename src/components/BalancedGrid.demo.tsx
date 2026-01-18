import { BalancedGrid } from '@/components'
import type { DemoMeta } from '@demo/utils'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'BalancedGrid', category: 'components' }

export const Demo = () => {
	const [itemCount, setItemCount] = useState(7)
	const [maxCols, setMaxCols] = useState(3)
	const [pack, setPack] = useState(false)

	return (
		<main className='demo'>
			<fieldset className='fieldset size-full place-items-center'>
				<p className='label'>Pack last row</p>
				<input checked={pack} className='toggle' type='checkbox' onChange={(e) => setPack(e.target.checked)} />
				<p className='label'>Item count: {itemCount}</p>
				<input
					className='range'
					max={25}
					min={1}
					type='range'
					value={itemCount}
					onChange={(e) => setItemCount(e.target.valueAsNumber)}
				/>
				<p className='label'>Max # of columns: {maxCols}</p>
				<input
					className='range'
					max={10}
					min={1}
					type='range'
					value={maxCols}
					onChange={(e) => setMaxCols(e.target.valueAsNumber)}
				/>
			</fieldset>
			<BalancedGrid className='gap-2 place-items-center w-full' pack={pack} maxCols={maxCols}>
				{[...Array(itemCount).keys()].map((i) => (
					<div className='paper grid place-items-center h-20 w-full' key={i}>
						{i + 1}
					</div>
				))}
			</BalancedGrid>
		</main>
	)
}
