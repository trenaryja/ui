import { colors } from '@/utils'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import * as R from 'remeda'
import type { Config } from 'tailwindcss'
import { distCssDir, generatedDir, log, srcCssDir } from './utils'

const setup = () => {
	fs.rmSync(generatedDir, { recursive: true, force: true })
	fs.mkdirSync(generatedDir, { recursive: true })
}

const generateTailwindConfig = () => {
	const config: Config = { content: { files: ['!../../**/*'] } }
	const configFile = path.join(generatedDir, 'tailwind.config.ts')
	fs.writeFileSync(
		configFile,
		`import type { Config } from 'tailwindcss'; export default ${JSON.stringify(config, null, 2)} satisfies Config`,
		'utf-8',
	)
	log(`Generated tailwind.config.ts`)
}

const generateProseCss = () => {
	const proseClasses = [
		'prose',
		...['invert', 'sm', 'lg', 'xl', '2xl'].map((x) => `prose-${x}`),
		...R.keys(colors).map((c) => `prose-${c}`),
	]
	const proseCss =
		`@plugin '@tailwindcss/typography';\n` +
		`@import '../../node_modules/daisyui/utilities/typography.css';\n` +
		`@config './tailwind.config.ts';\n` +
		`@layer utilities {\n` +
		`${proseClasses.map((cls) => `.${cls}{@apply ${cls};}`).join('\n')}\n` +
		`}\n`
	fs.writeFileSync(path.join(generatedDir, 'prose.css'), proseCss, 'utf-8')
	log(`Generated ${proseClasses.length} prose classes → prose.css`)
}

const generateBrowserCss = () => {
	const allUtilities = new Set<string>()
	for (const f of fs.readdirSync(srcCssDir).filter((f) => f.endsWith('.css'))) {
		const file = fs.readFileSync(path.join(srcCssDir, f), 'utf-8')
		for (const m of file.matchAll(/@utility\s+([\w-]+)/g)) allUtilities.add(m[1])
	}
	const browserCss =
		`@import 'tailwindcss';\n` +
		`@plugin 'daisyui' { themes: all; };\n` +
		`@import '../../node_modules/daisyui/daisyui.css';\n` +
		`@import '../css/index.css';\n` +
		`@import './prose.css';\n` +
		`@config './tailwind.config.ts';\n` +
		[...allUtilities].map((u) => `@source inline('${u}');`).join('\n')
	fs.writeFileSync(path.join(generatedDir, 'browser.css'), browserCss, 'utf-8')
	log(`Generated ${allUtilities.size} utils → browser.css`)
}

const compileGeneratedToDist = () => {
	for (const f of fs.readdirSync(generatedDir).filter((f) => f.endsWith('.css'))) {
		const input = path.join(generatedDir, f)
		const dist = path.join(distCssDir, path.parse(f).name + '.css')
		const cmd = `tailwindcss -i ${input} -o ${dist}`
		log(cmd)
		execSync(cmd, { stdio: 'inherit' })
	}
}

const copySrcToDist = () => {
	fs.cpSync(srcCssDir, distCssDir, { recursive: true })
	log(`Copied src/css to dist/css`)
}

setup()
generateTailwindConfig()
generateProseCss()
generateBrowserCss()
compileGeneratedToDist()
copySrcToDist()
log('Done!')
