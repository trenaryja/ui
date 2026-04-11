import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { afterAll, test } from 'bun:test'

const repoRoot = resolve(import.meta.dir, '../..')
const sandboxRoot = join(repoRoot, '.test-sandbox')

afterAll(() => rmSync(sandboxRoot, { recursive: true, force: true }))

test('preflight: dist type definitions are built', () => {
	if (!existsSync(resolve(repoRoot, 'dist/index.d.ts'))) {
		throw new Error('dist/index.d.ts not found — run `bun run build` before running build tests.')
	}
})

test('consumer with moduleResolution: nodenext can type-check against published types', () => {
	mkdirSync(sandboxRoot, { recursive: true })
	const tmp = mkdtempSync(join(sandboxRoot, 'consumer-'))
	mkdirSync(join(tmp, 'node_modules/@trenaryja'), { recursive: true })
	symlinkSync(repoRoot, join(tmp, 'node_modules/@trenaryja/ui'))
	writeFileSync(
		join(tmp, 'tsconfig.json'),
		JSON.stringify({
			compilerOptions: {
				module: 'nodenext',
				moduleResolution: 'nodenext',
				target: 'esnext',
				strict: true,
				noEmit: true,
				jsx: 'react-jsx',
				skipLibCheck: true,
			},
			include: ['index.ts'],
		}),
	)
	writeFileSync(
		join(tmp, 'index.ts'),
		`import * as root from '@trenaryja/ui'\nimport * as utils from '@trenaryja/ui/utils'\nvoid root\nvoid utils\n`,
	)
	const tsc = resolve(repoRoot, 'node_modules/.bin/tsc')
	const result = spawnSync(tsc, ['-p', tmp], { encoding: 'utf8' })

	if (result.status !== 0) {
		throw new Error(
			`Consumer type-check failed — simulates a downstream TS project using @trenaryja/ui with moduleResolution: nodenext.\n\n` +
				`${result.stdout}${result.stderr}\n` +
				`Likely causes:\n` +
				`  • "types" condition missing from package.json "exports", or listed AFTER "import" — TS requires "types" FIRST in the conditional object under nodenext/node16.\n` +
				`  • An expected public export is missing from dist/**/*.d.ts.\n` +
				`  • A shipped .d.ts file has an unresolved module or type reference.`,
		)
	}
})
