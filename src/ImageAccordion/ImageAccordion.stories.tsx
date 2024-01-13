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
    <ImageAccordion type='single' collapsible>
      {Array.from(Array(5).keys()).map((i) => (
        <ImageAccordion.AccordionItem
          value={`${i}`}
          src={`https://source.unsplash.com/random/500x500/?${i})`}
          className='grayscale'
        >
          <ImageAccordion.AccordionTrigger className='text-white bg-black/50'>
            <div className='flex w-full justify-center p-2 font-bold'>Accordion Item {i + 1}</div>
          </ImageAccordion.AccordionTrigger>
          <ImageAccordion.AccordionContent className='aspect-square'></ImageAccordion.AccordionContent>
        </ImageAccordion.AccordionItem>
      ))}
    </ImageAccordion>
  ),
}
