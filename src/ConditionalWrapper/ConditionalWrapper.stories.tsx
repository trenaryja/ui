import { Box, Switch, Text } from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import { Meta, StoryObj } from '@storybook/react'
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
    const [condition, toggle] = useToggle()
    return (
      <Box sx={(theme) => ({ display: 'grid', gap: theme.spacing.xl })}>
        <Switch onChange={() => toggle()} label='Apply Wrapper' />
        <ConditionalWrapper
          condition={condition}
          wrapper={(children) => (
            <Box
              p='xl'
              w='fit-content'
              sx={(theme) => ({
                backgroundImage: `repeating-radial-gradient( circle at 0 0, transparent 0, ${theme.black} .75rem ), repeating-linear-gradient( ${theme.colors.gray[9]}, ${theme.colors.gray[7]} )`,
              })}
            >
              <Text component='h1' ta='center' fz='3rem' p='xl' bg='rgba(0,0,0,.5)'>
                {children}
              </Text>
            </Box>
          )}
        >
          Hello World 👋🌎
        </ConditionalWrapper>
      </Box>
    )
  },
}
