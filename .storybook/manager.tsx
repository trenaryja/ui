import { addons } from '@storybook/manager-api'
import { themes } from '@storybook/theming'

// @ts-ignore
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
      '<img src="https://source.unsplash.com/random/500x80/?hexagons" style="width: 100%; display: block; object-fit: cover; height: 5rem; object-position: center; border-radius: 1rem; filter: grayscale(1)" title="@trenaryja/ui" />',
    brandTarget: '_blank',
  },
})
