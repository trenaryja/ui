import { BalancedGrid } from '@/components'
import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

type Story = StoryObj<typeof BalancedGrid>
const meta: Meta<typeof BalancedGrid> = {
	title: 'components/BalancedGrid',
	component: BalancedGrid,
}
export default meta

export const Default: Story = {
	name: 'BalancedGrid',
	render: () => {
		const [itemCount, setItemCount] = useState(7)
		const [maxCols, setMaxCols] = useState(3)
		const [pack, setPack] = useState(false)

		return (
			<main className='demo'>
				<fieldset className='fieldset size-full place-items-center'>
					<p className='label'>Pack last row</p>
					<input type='checkbox' className='toggle' checked={pack} onChange={(e) => setPack(e.target.checked)} />
					<p className='label'>Item count: {itemCount}</p>
					<input
						type='range'
						className='range'
						value={itemCount}
						min={1}
						max={25}
						onChange={(e) => setItemCount(e.target.valueAsNumber)}
					/>
					<p className='label'>Max # of columns: {maxCols}</p>
					<input
						type='range'
						className='range'
						value={maxCols}
						min={1}
						max={10}
						onChange={(e) => setMaxCols(e.target.valueAsNumber)}
					/>
				</fieldset>
				<BalancedGrid className='gap-2 place-items-center w-full' maxCols={maxCols} pack={pack}>
					{[...Array(itemCount).keys()].map((i) => (
						<div key={i} className='paper grid place-items-center h-20 w-full'>
							{i + 1}
						</div>
					))}
				</BalancedGrid>
			</main>
		)
	},
}
