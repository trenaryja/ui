import { Meta, StoryObj } from '@storybook/react'
import { ScaledText } from '.'

type Story = StoryObj<typeof ScaledText>
const meta: Meta<typeof ScaledText> = {
  title: 'components/ScaledText',
  component: ScaledText,
}
export default meta

const defaultValues = {
  lines: ['Hello', 'World', '👋🌎'],
}

export const Default: Story = {
  name: 'ScaledText',
  argTypes: {
    lines: {
      defaultValue: defaultValues.lines,
    },
  },
  render: (args) => {
    return (
      <div style={{ width: '10rem', resize: 'horizontal', overflow: 'auto' }}>
        <ScaledText {...args} lines={args.lines ?? defaultValues.lines} />
      </div>
    )
  },
}
