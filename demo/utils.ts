import * as R from 'remeda'

export const categories = ['components', 'hooks', 'classes', 'search', 'other'] as const
export type Category = (typeof categories)[number]

export const categoryLabels = {
	components: 'Components',
	hooks: 'Hooks',
	classes: 'Classes',
	search: 'Search',
	other: 'Other',
} as const satisfies Record<Category, unknown>

export type DemoMeta = { title: string; category: Category }

type DemoModule = { meta: DemoMeta; Demo: React.ComponentType }

const modules = import.meta.glob<DemoModule>('../src/**/*.demo.tsx', { eager: true })

export const demos = R.entries(modules).map(([path, mod]) => ({
	...mod,
	id: path.replace('../src/', '').replace('.demo.tsx', '').replace(/\//g, '-').toLowerCase(),
	path,
}))

export const demosByCategory = R.reduce(
	demos,
	(acc, demo) => {
		const { category } = demo.meta
		if (!acc[category]) acc[category] = []
		acc[category].push(demo)
		return acc
	},
	{} as Record<string, typeof demos>,
)
