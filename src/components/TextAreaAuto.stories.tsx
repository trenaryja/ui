import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { TextAreaAuto } from '@/components/TextAreaAuto'
import { cn } from '@/utils'

const meta = {
	title: 'components/TextAreaAuto',
	component: TextAreaAuto,
} satisfies Meta<typeof TextAreaAuto>

export default meta

type Story = StoryObj<typeof TextAreaAuto>

export const Default: Story = {
	name: 'TextAreaAuto',
	render: () => {
		const [applyMinHeight, setApplyMinHeight] = useState(false)
		const [applyMaxHeight, setApplyMaxHeight] = useState(true)

		return (
			<div className='demo'>
				<label className='flex items-center gap-2'>
					<input
						checked={applyMinHeight}
						className='toggle'
						type='checkbox'
						onChange={(e) => setApplyMinHeight(e.target.checked)}
					/>
					<span>Apply Min Height</span>
				</label>

				<label className='flex items-center gap-2'>
					<input
						checked={applyMaxHeight}
						className='toggle'
						type='checkbox'
						onChange={(e) => setApplyMaxHeight(e.target.checked)}
					/>
					<span>Apply Max Height</span>
				</label>

				<TextAreaAuto
					className={cn('textarea', applyMinHeight && 'min-h-60', applyMaxHeight && 'max-h-60')}
					placeholder='Type a bunch of lines to see the auto-height behavior…'
				/>
			</div>
		)
	},
}
