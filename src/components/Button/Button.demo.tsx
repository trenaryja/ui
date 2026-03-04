import { Button, Fieldset } from '@/components'
import type { DemoMeta } from '@demo'
import { LuCircle, LuSquare } from 'react-icons/lu'

export const meta: DemoMeta = { title: 'Button', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo'>
			<Fieldset legend='Default' className='fieldset-flex-examples'>
				<Button>Button</Button>
			</Fieldset>

			<Fieldset legend='Modifiers' className='fieldset-flex-examples'>
				<Button className='btn-active'>Active</Button>
				<Button disabled>Disabled</Button>
			</Fieldset>

			<Fieldset legend='Shape' className='fieldset-flex-examples w-full'>
				<Button className='btn-square'>
					<LuSquare />
				</Button>
				<Button className='btn-circle'>
					<LuCircle />
				</Button>
				<Button className='btn-wide'>Wide</Button>
				<Button className='btn-block'>Block</Button>
			</Fieldset>

			<Fieldset legend='Styles' className='fieldset-flex-examples'>
				<Button className='btn-invert'>Invert</Button>
				<Button className='btn-outline'>Outline</Button>
				<Button className='btn-dash'>Dash</Button>
				<Button className='btn-soft'>Soft</Button>
				<Button className='btn-ghost'>Ghost</Button>
				<Button className='btn-link'>Link</Button>
			</Fieldset>

			<Fieldset legend='Sizes' className='fieldset-flex-examples'>
				<Button className='btn-xs'>Extra Small</Button>
				<Button className='btn-sm'>Small</Button>
				<Button className='btn-md'>Medium</Button>
				<Button className='btn-lg'>Large</Button>
				<Button className='btn-xl'>Extra Large</Button>
			</Fieldset>

			<Fieldset legend='Colors' className='fieldset-flex-examples'>
				<Button className='btn-primary'>Primary</Button>
				<Button className='btn-secondary'>Secondary</Button>
				<Button className='btn-accent'>Accent</Button>
				<Button className='btn-neutral'>Neutral</Button>
				<Button className='btn-info'>Info</Button>
				<Button className='btn-success'>Success</Button>
				<Button className='btn-warning'>Warning</Button>
				<Button className='btn-error'>Error</Button>
			</Fieldset>
		</div>
	)
}
