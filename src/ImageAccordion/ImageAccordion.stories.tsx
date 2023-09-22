import { Box, Flex, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import { ImageAccordion } from '..'

type Story = StoryObj<typeof ImageAccordion>

const meta: Meta<typeof ImageAccordion> = {
  title: 'components/ImageAccordion',
  component: ImageAccordion,
}
export default meta

export const Default: Story = {
  name: 'ImageAccordion',
  render: () => (
    <ImageAccordion
      // transitionDuration={750}
      sx={(theme) => ({
        display: 'grid',
        gap: theme.spacing.xs,
        maxWidth: '500px',
      })}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <ImageAccordion.Item key={i} value={`${i}`} imageUrl={`https://source.unsplash.com/random/500x500/?${i}`}>
          <ImageAccordion.Control>
            <Flex justify='center'>
              <Text bg='rgba(0,0,0,.5)' p='xs'>
                Accordion Item {i + 1}
              </Text>
            </Flex>
          </ImageAccordion.Control>
          <ImageAccordion.Panel>
            <Box sx={{ aspectRatio: '1' }} />
          </ImageAccordion.Panel>
        </ImageAccordion.Item>
      ))}
    </ImageAccordion>
  ),
}
