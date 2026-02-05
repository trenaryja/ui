import { BalancedGrid, Input, Modal } from '@/components'
import { useCycle } from '@/hooks'
import { cn } from '@/utils'
import { useClipboard, useDebouncedValue } from '@mantine/hooks'
import type { ReactNode } from 'react'
import { useState } from 'react'
import * as R from 'remeda'

type SearchableGridProps<TItem, TFamily extends string, TCopyKey extends string> = {
	// Data
	items: TItem[]
	families: Record<TFamily, { label: string; sample: ReactNode }>

	// Search
	getSearchText: (item: TItem) => string
	getFamily: (item: TItem) => TFamily | undefined
	placeholder?: string

	// Copy cycle
	copyKeys: readonly TCopyKey[]
	getCopyValue: (item: TItem, key: TCopyKey) => string

	// Rendering
	renderItem: (item: TItem) => ReactNode
	renderCopiedOverlay: (item: TItem, copiedKey: TCopyKey) => ReactNode
	getItemId: (item: TItem) => string

	// Optional
	className?: string
	debounceMs?: number
	maxResults?: number
	settingsIcon?: ReactNode
}

const clipboardTimeout = 1000

export function SearchableGrid<TItem, TFamily extends string, TCopyKey extends string>({
	items,
	families,
	getSearchText,
	getFamily,
	placeholder = 'Search...',
	copyKeys,
	getCopyValue,
	renderItem,
	renderCopiedOverlay,
	getItemId,
	className,
	debounceMs = 200,
	maxResults = 300,
	settingsIcon,
}: SearchableGridProps<TItem, TFamily, TCopyKey>) {
	const [query, setQuery] = useState('')
	const [debouncedQuery] = useDebouncedValue(query, debounceMs)
	const cycle = useCycle(copyKeys, { idleResetMs: clipboardTimeout + 50 })
	const clipboard = useClipboard({ timeout: clipboardTimeout })
	const [lastCopiedId, setLastCopiedId] = useState<string | null>(null)
	const [activeFamilies, setActiveFamilies] = useState<TFamily[]>([])
	const [familySearch, setFamilySearch] = useState('')

	// Filter by family
	const familyFiltered = activeFamilies.length
		? items.filter((item) => {
				const fam = getFamily(item)
				return fam !== undefined && activeFamilies.includes(fam)
			})
		: items

	// Search filter (multi-word AND matching)
	const queryWords = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean)
	const results = queryWords.length
		? familyFiltered
				.filter((item) => {
					const text = getSearchText(item).toLowerCase()
					return queryWords.every((word) => text.includes(word))
				})
				.slice(0, maxResults)
		: familyFiltered.slice(0, maxResults)

	const toggleFamily = (family: TFamily) =>
		setActiveFamilies((prev) => (prev.includes(family) ? prev.filter((f) => f !== family) : [...prev, family]))

	const handleClick = (item: TItem) => {
		clipboard.copy(getCopyValue(item, cycle.value))
		setLastCopiedId(getItemId(item))
		cycle.increment()
	}

	return (
		<div className={cn('full-bleed grid content-start gap-4 p-4', className)}>
			<Input
				className='w-full'
				type='search'
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder={placeholder}
			/>

			<div className='flex items-center justify-between'>
				<p className='text-sm text-base-content/50'>
					Showing {results.length} {debouncedQuery ? 'matches' : `items. Total ${familyFiltered.length}.`}
				</p>

				<Modal
					trigger={
						<button className='btn btn-ghost btn-square relative' type='button'>
							{settingsIcon}
							{activeFamilies.length > 0 && <span className='absolute size-2 rounded-full bg-primary top-0 right-0' />}
						</button>
					}
					className='h-[50vh] overflow-hidden'
					classNames={{ box: 'grid grid-rows-[auto_1fr] gap-4' }}
				>
					<Input
						autoFocus
						type='search'
						placeholder='Search families...'
						value={familySearch}
						onChange={(e) => setFamilySearch(e.target.value)}
						className='w-full'
					/>

					<BalancedGrid pack className='gap-2 overflow-y-fade no-scrollbar content-start' maxCols={3}>
						{R.entries(families)
							.filter(([, fam]) => fam.label.toLowerCase().includes(familySearch.toLowerCase()))
							.map(([key, fam]) => (
								<button
									key={key}
									type='button'
									onClick={() => toggleFamily(key)}
									className={cn('btn btn-sm flex-col gap-2 h-auto py-1', {
										'btn-primary': activeFamilies.includes(key),
									})}
								>
									{fam.sample}
									<div className='font-mono truncate w-full'>{fam.label}</div>
								</button>
							))}
					</BalancedGrid>
				</Modal>
			</div>

			<div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
				{results.map((item) => {
					const id = getItemId(item)
					return (
						<button
							className='btn relative grid place-items-center h-max p-4 overflow-hidden'
							key={id}
							type='button'
							onClick={() => handleClick(item)}
						>
							{renderItem(item)}
							{clipboard.copied && lastCopiedId === id && (
								<span className='absolute inset-0 grid place-items-center backdrop-blur-2xl'>
									{renderCopiedOverlay(item, cycle.prev)}
									<span className='text-sm'>Copied</span>
								</span>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}

// TODO: store filter state in url (make this a hook)
