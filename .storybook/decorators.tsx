import { Box } from '@mantine/core'
import React from 'react'

export const decorators = [
  (Story) => (
    <Box m={'xl'} ff='sans-serif'>
      <Story />
    </Box>
  ),
]
