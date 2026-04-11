import { describe, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { builtinModules } from 'node:module'
import { resolve } from 'node:path'
import pkg from '../../package.json' with { type: 'json' }

const repoRoot = resolve(import.meta.dir, '../..')

const collectTargets = (value: unknown): string[] =>
	typeof value === 'string'
		? [value]
		: value && typeof value === 'object'
			? Object.values(value).flatMap(collectTargets)
			: []

describe('dist integrity', () => {
	test('preflight: dist is built', () => {
		if (!existsSync(resolve(repoRoot, 'dist/index.js'))) {
			throw new Error('dist/index.js not found — run `bun run build` before running build tests.')
		}
	})

	test('every package.json "exports" target exists on disk', () => {
		const missing = Object.entries(pkg.exports).flatMap(([subpath, value]) =>
			collectTargets(value)
				.filter((target) => !existsSync(resolve(repoRoot, target)))
				.map((target) => `  exports["${subpath}"] → ${target}`),
		)

		if (missing.length) {
			throw new Error(
				`package.json "exports" references files that don't exist:\n${missing.join('\n')}\n\n` +
					`Likely cause: a postbuild step (build:css, build:nf, build:use-client) failed or was skipped.\n` +
					`Fix: run \`bun run build\` and verify the missing file is produced.`,
			)
		}
	})

	test('dist imports only declared dependencies, peerDependencies, or node builtins', () => {
		const allowed = new Set([
			...Object.keys(pkg.dependencies ?? {}),
			...Object.keys(pkg.peerDependencies ?? {}),
			...builtinModules,
		])
		const files = [...new Bun.Glob('dist/**/*.{js,mjs}').scanSync({ cwd: repoRoot })]
		if (files.length === 0) throw new Error('No dist/**/*.{js,mjs} files found — build produced no JS output.')
		const violations = files.flatMap((file) => {
			const content = readFileSync(resolve(repoRoot, file), 'utf8')
			return [...content.matchAll(/from\s*["']([^"']+)["']/g)]
				.map((m) => m[1])
				.filter((spec) => !spec.startsWith('.') && !spec.startsWith('/') && !spec.startsWith('node:'))
				.map((spec) => (spec.startsWith('@') ? spec.split('/', 2).join('/') : spec.split('/')[0]))
				.filter((root) => !allowed.has(root))
				.map((root) => `  ${file}: "${root}"`)
		})

		if (violations.length) {
			throw new Error(
				`dist imports modules not declared as dependencies or peerDependencies:\n${[...new Set(violations)].join('\n')}\n\n` +
					`This means consumers will get "Cannot find module" errors at runtime.\n` +
					`Fix: add the package to "dependencies" or "peerDependencies", OR mark it as external in tsup config, OR stop importing it from shipped code.`,
			)
		}
	})

	test('CSS exports contain real compiled content, not empty shells', () => {
		const checks = [
			{
				path: 'dist/css/index.css',
				minBytes: 100,
				mustMatch: /@import/,
				desc: 'CSS aggregator missing @import statements',
			},
			{
				path: 'dist/css/prose.css',
				minBytes: 1000,
				mustMatch: /\.prose/,
				desc: 'Typography output missing .prose selectors',
			},
			{
				path: 'dist/css/browser.css',
				minBytes: 100_000,
				mustMatch: /tailwindcss/i,
				desc: 'Browser CSS missing tailwind compile output',
			},
		]
		const failures = checks.flatMap(({ path, minBytes, mustMatch, desc }) => {
			const full = resolve(repoRoot, path)
			if (!existsSync(full)) return [] // covered by the "exports exist" test above
			const content = readFileSync(full, 'utf8')
			if (content.length < minBytes) return [`  ${path}: ${content.length} bytes (expected ≥ ${minBytes}) — ${desc}`]
			if (!mustMatch.test(content)) return [`  ${path}: missing marker ${mustMatch} — ${desc}`]
			return []
		})

		if (failures.length) {
			throw new Error(
				`CSS outputs look empty or half-compiled:\n${failures.join('\n')}\n\n` +
					`Likely cause: scripts/build-css.ts partially failed, or a tailwind/postcss step produced an empty shell (preamble only, no selectors).\n` +
					`Fix: run \`bun run build:css\` and inspect the affected file manually.`,
			)
		}
	})

	test('dist/index.js preserves "use client" directive for RSC consumers', () => {
		const content = readFileSync(resolve(repoRoot, 'dist/index.js'), 'utf8')

		if (!/^["']use client["']\s*;?/.test(content)) {
			throw new Error(
				`dist/index.js is missing the "use client" directive at the top of the file.\n\n` +
					`This silently breaks Next.js App Router and other RSC consumers — they'll try to render client hooks on the server.\n` +
					`Likely cause: scripts/build-use-client.ts failed to run during postbuild.\n` +
					`Fix: run \`bun run build:use-client\` and verify dist/index.js starts with \`"use client";\`.`,
			)
		}
	})
})
