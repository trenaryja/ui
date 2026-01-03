import { ConditionalWrapper } from '@/components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const meta = { title: 'components/ConditionalWrapper' } satisfies Meta
export default meta

export const Default: StoryObj = {
	name: 'ConditionalWrapper',
	render: () => {
		const [isChecked, setIsChecked] = useState(false)

		return (
			<div className='demo'>
				<div className='flex gap-2'>
					<input
						checked={isChecked}
						className='checkbox'
						id='checkbox'
						type='checkbox'
						onChange={() => setIsChecked(!isChecked)}
					/>
					<label htmlFor='checkbox'>Apply Wrapper</label>
				</div>
				<ConditionalWrapper
					condition={isChecked}
					wrapper={(children) => (
						<div className='p-10 w-fit rounded-full bg-[repeating-radial-gradient(circle_at_50%_50%,transparent_0,color-mix(in_oklch,currentColor_50%,transparent)_2rem)]'>
							<h1 className='p-10 text-5xl backdrop-blur rounded-full whitespace-nowrap'>{children}</h1>
						</div>
					)}
				>
					Hello World 👋🌎
				</ConditionalWrapper>
			</div>
		)
	},
}
