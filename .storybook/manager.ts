import { addons } from '@storybook/addons'
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
    brandTitle: '@trenaryja/ui',
    brandUrl: 'https://justintrenary.netlify.app',
    brandImage: 'https://picsum.photos/350/150?grayscale',
    brandTarget: '_blank',
  },
})
