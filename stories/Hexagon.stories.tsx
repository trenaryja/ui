import { nest } from '@/utils'
import { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = { title: 'classes/hexagon' }
export default meta

export const Default: StoryObj = {
	name: 'hexagon',
	render: () => {
		return (
			<div className='demo grid-cols-2 prose'>
				<h1>tall</h1>
				<h1>wide</h1>

				<div className='hexagon-tall h-fit p-6 bg-base-200 grid place-items-center'>
					<span>sized to content</span>
				</div>
				<div className='hexagon-wide w-fit p-6 bg-base-200 grid place-items-center'>
					<span>sized to content</span>
				</div>

				<div className='hexagon-tall h-full bg-base-200 grid place-items-center'>
					<span>sized to container</span>
				</div>
				<div className='hexagon-wide w-full bg-base-200 grid place-items-center'>
					<span>sized to container</span>
				</div>

				{nest(6, <div className='hexagon-tall h-fit w-full bg-base-content/20 px-6' />)}
				{nest(6, <div className='hexagon-wide bg-base-content/20 px-6 flex items-end' />)}
				{nest(6, <div className='hexagon-tall bg-base-content/20 px-6' />)}
				{nest(6, <div className='hexagon-tall bg-base-content/20 p-4 animate-spin [animation-duration:600s]' />)}
			</div>
		)
	},
}
