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
		return categoryDemos.filter(
			(demo) =>
				demo.meta.title.toLowerCase().includes(query) ||
				demo.meta.tags?.some((tag) => tag.toLowerCase().includes(query)),
		)
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
							type='search'
							placeholder='Search...'
							className='input'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<nav className='overflow-fade size-full'>
						<ul className='menu w-full'>
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
													<a href={`/#${demo.id}`}>
														{demo.meta.title}
														{demo.meta.tags?.map((tag) => (
															<span key={tag} className='badge badge-xs badge-soft'>
																{tag}
															</span>
														))}
													</a>
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

			<div className='drawer-content flex flex-col h-dvh'>
				<header className='flex items-center p-2 justify-between bg-base-200'>
					<label htmlFor='sidebar' className='btn btn-ghost btn-square  lg:invisible'>
						<LuPanelLeft />
					</label>
					<span className='font-bold'>{currentDemo?.meta.title}</span>
					<ThemePicker variant='popover' classNames={{ popover: 'mr-2' }} />
				</header>

				<main className='full-bleed-container overflow-fade size-full'>{PageContent}</main>
			</div>
		</div>
	)
}
