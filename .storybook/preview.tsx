import { Box, MantineProvider } from '@mantine/core'
import { Preview } from '@storybook/react'
import { ensure, themes } from '@storybook/theming'
import React from 'react'

const preview: Preview = {
  decorators: [
    (Story) => (
      <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
        <Box m='xl' ff='sans-serif'>
          <Story />
        </Box>
      </MantineProvider>
    ),
  ],
  parameters: {
    actions: { disable: true },
    docs: { theme: ensure(themes.dark) },
  },
}

export default preview
