import { Image } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import ReactMarkdown from 'react-markdown'
import readMe from '../README.md?raw'

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
        // Hexagons
        src='https://i.giphy.com/media/ehssta24116nk9VWyN/giphy.webp'
        // Robin Williams
        // src='https://i.giphy.com/media/1UUO43fwtuDX175I3i/giphy.webp'
        // Lava Lamp
        // src='https://i.giphy.com/media/3q3SUqPnxZGQpMNcjc/giphy.webp'
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
