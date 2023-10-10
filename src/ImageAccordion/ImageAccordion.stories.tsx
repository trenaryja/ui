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
      sx={(theme) => ({
        display: 'grid',
        gap: theme.spacing.xs,
        maxWidth: '500px',
      })}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <ImageAccordion.Item key={i} value={`${i}`} imageUrl={`https://source.unsplash.com/random/500x500/?${i}`}>
          <ImageAccordion.Control>
            <p className='flex justify-center p-3 bg-black bg-opacity-50'>Accordion Item {i + 1}</p>
          </ImageAccordion.Control>
          <ImageAccordion.Panel>
            <div className='aspect-square' />
          </ImageAccordion.Panel>
        </ImageAccordion.Item>
      ))}
    </ImageAccordion>
  ),
}
