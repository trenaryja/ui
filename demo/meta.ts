import type { ComponentType } from 'react'
import * as R from 'remeda'

export const categories = ['components', 'hooks', 'classes', 'search', 'other'] as const
export type Category = (typeof categories)[number]

export type DemoMeta = { title: string; category: Category; tags?: string[] }

type DemoModule = { meta: DemoMeta; Demo: ComponentType }

export const demos = R.entries(import.meta.glob<DemoModule>('../**/*.demo.tsx', { eager: true })).map(
	([path, demo]) => ({
		...demo,
		id: path.split('/').pop()!.replace('.demo.tsx', '').toLowerCase(),
		path,
	}),
)

export const demosByCategory: Record<string, typeof demos> = R.groupBy(demos, (demo) => demo.meta.category)
