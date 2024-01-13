import { Preview } from '@storybook/react'
import { ensure, themes } from '@storybook/theming'
import React from 'react'

const preview: Preview = {
  decorators: [(Story) => <Story />],
  parameters: {
    docs: { theme: ensure(themes.dark) },
  },
}

export default preview
