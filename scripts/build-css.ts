import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import type { Config } from 'tailwindcss'
import { fileURLToPath } from 'url'

const log = (m: string) => console.log(`▶ ${m}`)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcCssDir = path.join(__dirname, '../src/css')
const generatedDir = path.join(__dirname, '../src/_generated')

fs.rmSync(generatedDir, { recursive: true, force: true })
fs.mkdirSync(generatedDir, { recursive: true })

const config: Config = { content: { files: ['!../../**/*'] } }
const configFile = path.join(generatedDir, 'tailwind.config.ts')

fs.writeFileSync(
	configFile,
	`import type { Config } from 'tailwindcss'; export default ${JSON.stringify(config, null, 2)} satisfies Config`,
	'utf-8',
)

const allUtilities = new Set<string>()
for (const f of fs.readdirSync(srcCssDir).filter((f) => f.endsWith('.css'))) {
	const file = fs.readFileSync(path.join(srcCssDir, f), 'utf-8')
	for (const m of file.matchAll(/@utility\s+([\w-]+)/g)) allUtilities.add(m[1])
}

const browserCss =
	`@import '../css/index.css';\n` +
	`@config './tailwind.config.ts';\n` +
	[...allUtilities].map((u) => `@source inline('${u}');`).join('\n')
fs.writeFileSync(path.join(generatedDir, 'browser.css'), browserCss, 'utf-8')
log(`Generated ${allUtilities.size} utils → browser.css`)

const proseClasses = [
	'prose',
	'prose-invert',
	'prose-sm',
	'prose-lg',
	'prose-xl',
	'prose-2xl',
	'prose-slate',
	'prose-gray',
	'prose-zinc',
	'prose-neutral',
	'prose-stone',
	'prose-red',
	'prose-orange',
	'prose-amber',
	'prose-yellow',
	'prose-lime',
	'prose-green',
	'prose-emerald',
	'prose-teal',
	'prose-cyan',
	'prose-sky',
	'prose-blue',
	'prose-indigo',
	'prose-violet',
	'prose-purple',
	'prose-fuchsia',
	'prose-pink',
	'prose-rose',
]

const proseCss =
	`@plugin '@tailwindcss/typography';\n` +
	`@config './tailwind.config.ts';\n\n` +
	proseClasses.map((cls) => `.${cls}{@apply ${cls};}`).join('\n')
fs.writeFileSync(path.join(generatedDir, 'prose.css'), proseCss, 'utf-8')
log(`Generated ${proseClasses.length} prose classes → prose.css`)

for (const f of fs.readdirSync(generatedDir).filter((f) => f.endsWith('.css'))) {
	const input = path.join(generatedDir, f)
	const dist = path.join(__dirname, '../dist/css', path.parse(f).name + '.css')
	const cmd = `tailwindcss -i ${input} -o ${dist}`
	log(cmd)
	execSync(cmd, { stdio: 'inherit' })
}

const distCssDir = path.join(__dirname, '../dist/css')
if (fs.existsSync(srcCssDir)) {
	fs.cpSync(srcCssDir, distCssDir, { recursive: true })
	log(`Copied src/css to dist/css`)
}
