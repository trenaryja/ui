import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'

// @ts-expect-error importing favicon
import favicon from './favicon.svg'

const link = document.createElement('link')
link.setAttribute('rel', 'shortcut icon')
link.setAttribute('href', favicon)
document.head.appendChild(link)

addons.setConfig({
	theme: {
		...themes.dark,
		brandUrl: 'https://trenary.dev',
		brandTitle:
			'<img src="https://www.trenary.dev/icon.svg" style="width: 100%; object-fit: contain; height: 3rem; object-position: center; filter: grayscale(1) brightness(0) invert(1)" title="@trenaryja/ui" />',
		brandTarget: '_blank',
	},
})
