import { ThemePicker, ThemeProvider } from '@/components'
import type { DemoMeta } from '@demo/utils'

export const meta: DemoMeta = { title: 'ThemePicker', category: 'components' }

export const Demo = () => (
	<ThemeProvider>
		<div className='demo'>
			<ThemePicker />
		</div>
	</ThemeProvider>
)
