import { cn } from '@/utils'
import { useClipboard } from '@mantine/hooks'
import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import raw from 'rehype-raw'
import readMe from '../README.md?raw'

const meta: Meta = { title: 'ReadMe', decorators: [] }
export default meta

const backgrounds = [
	// Hexagons
	'https://i.giphy.com/media/ehssta24116nk9VWyN/giphy.webp',
	// Robin Williams
	'https://i.giphy.com/media/1UUO43fwtuDX175I3i/giphy.webp',
	// Lava Lamp
	'https://i.giphy.com/media/3q3SUqPnxZGQpMNcjc/giphy.webp',
	// Dark Water
	'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDRlaHh0N2tqM2xib3F5dGg1dGxneG1pcTNjdXQyMGJ1czdibXI1YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Byour3OgR0nWnRR6Tc/giphy.gif',
	// Galaxy Zoom
	'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ1bXF2cmJvNnV0dTNqYTcybDZ5NHo4cW1wM3VibDc4cTA1bzNocyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2UxWBIttMvvIJ55hTe/giphy.gif',
	// Nodes and Edges
	'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2NwZzZ5aXZjMGdvbDBscWM0MnQ3bGZiZmNnbW5sd243dGNqbmc5MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ITRemFlr5tS39AzQUL/giphy.gif',
	// Bulging Lines
	'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2g4bTZsN2hxeGJoMjJlNWcwaDh0aTM1MXpoMmV3bTFiZG5saWwwdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LLYMoDblVhhjvjRBtj/giphy.gif',
]

export const ReadMe: StoryObj = {
	parameters: {
		options: { showPanel: false },
	},
	render: () => {
		const clipboard = useClipboard()
		const [lastCopied, setLastCopied] = useState<string | null>(null)

		return (
			<div className='grid justify-center'>
				<img
					className='fixed grayscale opacity-5 object-cover inset-0 size-full -z-10'
					src={backgrounds[Math.floor(Math.random() * backgrounds.length)]}
				/>
				<div className='prose prose-img:inline-block prose-img:m-0'>
					<ReactMarkdown
						components={{
							pre: ({ node: _node, ...props }) => (
								<div className='relative group'>
									<pre {...props} />
								</div>
							),
							code: ({ node: _node, children, className, ...props }) => {
								const toCopy = children?.toString().trim() || ''
								return (
									<code {...props} className={cn(className, 'size-full overflow-auto')}>
										{children}
										<button
											className='absolute top-2 right-2 btn btn-sm group-hover:visible invisible'
											onClick={() => {
												setLastCopied(toCopy)
												clipboard.copy(toCopy)
											}}
										>
											{clipboard.copied && lastCopied === toCopy ? 'Copied!' : 'Copy'}
										</button>
									</code>
								)
							},
						}}
						rehypePlugins={[raw]}
					>
						{readMe}
					</ReactMarkdown>
				</div>
			</div>
		)
	},
}
