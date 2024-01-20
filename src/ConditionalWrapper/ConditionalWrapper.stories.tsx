import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
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
    const [isChecked, setIsChecked] = useState(false)
    return (
      <div className='grid gap-10'>
        <div className='flex items-center gap-2'>
          <input type='checkbox' id='checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
          <label htmlFor='checkbox'>Apply Wrapper</label>
        </div>
        <ConditionalWrapper
          condition={isChecked}
          wrapper={(children) => (
            <div className='p-10 w-fit rounded-full bg-[repeating-radial-gradient(circle_at_50%_50%,_transparent_0,_black_1rem)]'>
              <h1 className='grayscale text-center text-5xl p-10 bg-black bg-opacity-50 rounded-full whitespace-nowrap'>
                {children}
              </h1>
            </div>
          )}
        >
          Hello World 👋🌎
        </ConditionalWrapper>
      </div>
    )
  },
}
