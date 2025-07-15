import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ConditionalWrapper } from '..'

const meta: Meta<typeof ConditionalWrapper> = {
	title: 'components/ConditionalWrapper',
	component: ConditionalWrapper,
}
export default meta
type Story = StoryObj<typeof ConditionalWrapper>

export const Default: Story = {
	name: 'ConditionalWrapper',
	render: () => {
		const [isChecked, setIsChecked] = useState(false)

		return (
			<div className='grid gap-10 place-items-center'>
				<div className='flex items-center gap-2'>
					<input type='checkbox' id='checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
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
