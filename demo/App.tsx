import { Input, ThemePicker } from '@/components'
import { cn } from '@/utils'
import { useHash } from '@mantine/hooks'
import { useState } from 'react'
import { LuPanelLeft } from 'react-icons/lu'
import { ReadMe } from './ReadMe'
import { categories, categoryLabels, demos, demosByCategory } from './utils'

export const App = () => {
	const [hash] = useHash()
	const route = hash.startsWith('#/') ? hash.slice(2) : hash.slice(1)
	const [searchQuery, setSearchQuery] = useState('')

	const currentDemo = demos.find((d) => d.id === route)
	const PageContent = currentDemo ? <currentDemo.Demo /> : <ReadMe />

	const filterDemos = (categoryDemos: (typeof demosByCategory)[string]) => {
		if (!searchQuery.trim()) return categoryDemos
		const query = searchQuery.toLowerCase()
		return categoryDemos.filter((demo) => demo.meta.title.toLowerCase().includes(query))
	}

	return (
		<div className='drawer lg:drawer-open'>
			<input id='sidebar' type='checkbox' className='drawer-toggle' />

			<div className='drawer-side'>
				<label htmlFor='sidebar' className='drawer-overlay' aria-label='toggle sidebar' />
				<aside className='bg-base-200 h-full flex flex-col gap-4'>
					<a href='/#' className='p-4 flex justify-center m-1'>
						<img src='https://trenary.dev/icon.svg' alt='' className='max-w-16' />
					</a>

					<div className='px-4'>
						<Input
							placeholder='Search...'
							className='input'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<nav className='overflow-auto'>
						<ul className='menu'>
							{categories.map((category) => {
								const categoryDemos = demosByCategory[category]
								if (!categoryDemos?.length) return null

								const filteredDemos = filterDemos(categoryDemos)
								if (!filteredDemos.length) return null

								return (
									<li key={category}>
										<h2 className='menu-title'>{categoryLabels[category]}</h2>
										<ul>
											{filteredDemos.map((demo) => (
												<li key={demo.id} className={cn({ 'menu-active': route === demo.id })}>
													<a href={`/#${demo.id}`}>{demo.meta.title}</a>
												</li>
											))}
										</ul>
									</li>
								)
							})}
						</ul>
					</nav>
				</aside>
			</div>

			<div className='drawer-content flex flex-col min-h-dvh'>
				<header className='navbar justify-between bg-base-200'>
					<label htmlFor='sidebar' className='btn btn-ghost btn-square lg:invisible'>
						<LuPanelLeft className='size-5' />
					</label>
					<span>{currentDemo?.meta.title}</span>
					<ThemePicker />
				</header>

				<main className='full-bleed-container h-full'>{PageContent}</main>
			</div>
		</div>
	)
}
