import { Meta, StoryObj } from '@storybook/react'
import { ImageAccordion } from '..'

type Story = StoryObj<typeof ImageAccordion>

const meta: Meta<typeof ImageAccordion> = {
  title: 'components/ImageAccordion',
  component: ImageAccordion,
}
export default meta
// data-[state=open]:pb-60
export const Default: Story = {
  name: 'ImageAccordion',
  render: () => (
    <ImageAccordion type='single' collapsible>
      {Array.from(Array(3).keys()).map((i) => (
        <ImageAccordion.Item
          value={`${i}`}
          key={i}
          src={`https://source.unsplash.com/random/500x500/?${i})`}
          className='grayscale transition-all text-white font-bold'
        >
          <ImageAccordion.Trigger className='bg-black/50'>
            <div className='grid w-full place-items-center p-2'>Accordion Item {i + 1}</div>
          </ImageAccordion.Trigger>
          <ImageAccordion.Content>
            <div className='grid p-2'>
              <h3 className='place-self-center grid w-fit min-w-40 place-items-center text-center bg-black/50 aspect-square rounded-full text-9xl'>
                {i + 1}
              </h3>
            </div>
          </ImageAccordion.Content>
        </ImageAccordion.Item>
      ))}
    </ImageAccordion>
  ),
}
