import { Meta, StoryObj } from '@storybook/react'
import { ScaledText } from '.'

const storyGroup = 'components/'
const storyName = 'ScaledText'
const meta: Meta<typeof ScaledText> = {
  title: `${storyGroup}${storyName}`,
  component: ScaledText,
}
export default meta
type Story = StoryObj<typeof ScaledText>

export const Default: Story = {
  storyName,
  argTypes: {
    lines: {
      defaultValue: ['Hello', 'World', '👋🌎'],
    },
  },
  render: (args) => {
    return (
      <div style={{ width: '10rem', resize: 'horizontal', overflow: 'auto' }}>
        <ScaledText {...args} />
      </div>
    )
  },
}
