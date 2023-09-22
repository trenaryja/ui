import { Meta, StoryObj } from '@storybook/react'
import { ScaledText } from '..'

type Story = StoryObj<typeof ScaledText>
const meta: Meta<typeof ScaledText> = {
  title: 'components/ScaledText',
  component: ScaledText,
}
export default meta

export const Default: Story = {
  name: 'ScaledText',
  render: (args) => {
    return (
      <div style={{ width: '10rem', resize: 'horizontal', overflow: 'auto' }}>
        <ScaledText {...args} />
      </div>
    )
  },
  args: {
    lines: ['Hello', 'World', '👋🌎'],
  },
}
