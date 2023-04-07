import { Image } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import ReactMarkdown from 'react-markdown'
import readMe from '../README.md'

const meta: Meta = { title: 'ReadMe', decorators: [] }
export default meta

export const ReadMe: StoryObj = {
  parameters: {
    options: { showPanel: false },
  },
  render: () => (
    <>
      <Image
        pos='fixed'
        inset={0}
        w='100%'
        height='100vh'
        fit='cover'
        opacity={0.025}
        style={{ zIndex: -1 }}
        src='https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmYxMDhhY2RjMTY2ZWE2ZTQ2MDZiZGMzMzFkNDA2NjA0NTU0NDI0OCZjdD1n/1UUO43fwtuDX175I3i/giphy.gif'
      />
      <ReactMarkdown
        components={{
          pre: ({ children }) => <pre style={{ backgroundColor: '#FFF1', padding: '1rem' }}>{children}</pre>,
        }}
      >
        {readMe}
      </ReactMarkdown>
    </>
  ),
}
