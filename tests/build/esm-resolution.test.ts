import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, test } from 'bun:test'
import pkg from '../../package.json' with { type: 'json' }

const repoRoot = resolve(import.meta.dir, '../..')

function collectJsTargets(value: unknown): string[] {
	if (typeof value === 'string') return /\.m?js$/.test(value) ? [value] : []
	if (value && typeof value === 'object') return Object.values(value).flatMap(collectJsTargets)
	return []
}

const jsEntries = Object.entries(pkg.exports).flatMap(([subpath, value]) =>
	[...new Set(collectJsTargets(value))].map((target) => [subpath, target] as const),
)

function importUnderNode(specifier: string) {
	const script = `await import(${JSON.stringify(specifier)})`
	return spawnSync('node', ['--input-type=module', '-e', script], { cwd: repoRoot, encoding: 'utf8' })
}

describe('published dist resolves under raw Node ESM', () => {
	test('preflight: dist is built', () => {
		if (!existsSync(resolve(repoRoot, 'dist/index.js'))) {
			throw new Error('dist/index.js not found — run `bun run build` before running build tests.')
		}
	})

	// Catches bugs where tsup leaves bare subpath imports without `.js`, which
	// bundlers silently fix but raw Node ESM rejects with ERR_MODULE_NOT_FOUND.
	test.each(jsEntries)('exports["%s"] → %s', (_subpath, target) => {
		const result = importUnderNode(target)

		if (result.status !== 0) {
			throw new Error(
				`Raw Node ESM failed to import ${target}:\n${result.stderr || result.stdout}\n\n` +
					`Likely cause: tsup emitted a bare subpath import without ".js" — bundlers auto-resolve it, but Node ESM requires the explicit extension.`,
			)
		}
	})
})
