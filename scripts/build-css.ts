import { tailwindColors } from '@/utils'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import * as R from 'remeda'
import { distCssDir, generatedDir, generateTailwindConfig, log, srcCssDir } from './utils'

const setup = () => {
	fs.rmSync(generatedDir, { recursive: true, force: true })
	fs.mkdirSync(generatedDir, { recursive: true })
}

const generateProseCss = () => {
	const proseClasses = [
		'prose',
		...['invert', 'sm', 'lg', 'xl', '2xl'].map((x) => `prose-${x}`),
		...R.keys(tailwindColors).map((c) => `prose-${c}`),
	]
	const proseCss =
		`@plugin '@tailwindcss/typography';\n` +
		`@import '../../node_modules/daisyui/utilities/typography.css';\n` +
		`@config './browser.tailwind.config.ts';\n` +
		`@layer utilities {\n` +
		`${proseClasses.map((cls) => `.${cls}{@apply ${cls};}`).join('\n')}\n` +
		`}\n`
	fs.writeFileSync(path.join(generatedDir, 'prose.css'), proseCss, 'utf-8')
	log(`Generated ${proseClasses.length} prose classes → prose.css`)
}

const generateBrowserCss = () => {
	const allUtilities = new Set<string>()

	for (const file of fs.readdirSync(srcCssDir).filter((f) => f.endsWith('.css'))) {
		const contents = fs.readFileSync(path.join(srcCssDir, file), 'utf-8')
		for (const m of contents.matchAll(/@utility\s+([\w-]+)/g)) allUtilities.add(m[1])
	}

	const browserCss =
		`@import 'tailwindcss';\n` +
		`@plugin 'daisyui' { themes: all; };\n` +
		`@import '../../node_modules/daisyui/daisyui.css';\n` +
		`@import '../css/index.css';\n` +
		`@import './prose.css';\n` +
		`@config './browser.tailwind.config.ts';\n${[...allUtilities].map((u) => `@source inline('${u}');`).join('\n')}`
	fs.writeFileSync(path.join(generatedDir, 'browser.css'), browserCss, 'utf-8')
	log(`Generated ${allUtilities.size} utils → browser.css`)
}

const generateComponentCss = () => {
	const componentCss = `@import 'tailwindcss';\n@config './component.tailwind.config.ts';\n`
	fs.writeFileSync(path.join(generatedDir, 'component.css'), componentCss, 'utf-8')
	log(`Generated component.css`)
}

const compileGeneratedToDist = () => {
	for (const file of fs.readdirSync(generatedDir).filter((f) => f.endsWith('.css'))) {
		const input = path.join(generatedDir, file)
		const dist = path.join(distCssDir, `${path.parse(file).name}.css`)
		const cmd = `tailwindcss -i ${input} -o ${dist}`
		log(cmd)
		execSync(cmd, { stdio: 'inherit' })
	}
}

const copySrcToDist = () => {
	fs.cpSync(srcCssDir, distCssDir, { recursive: true })
	log(`Copied src/css to dist/css`)
}

const injectFilesIntoIndex = () => {
	const indexCss = path.join(distCssDir, './index.css')
	fs.writeFileSync(
		indexCss,
		`@import './component.css';\n@import './prose.css';\n${fs.readFileSync(indexCss, 'utf-8')}`,
		'utf-8',
	)
	log(`Injected component.css import into ${indexCss}`)
}

setup()
generateTailwindConfig('browser.tailwind.config.ts', { content: { files: ['!../../**/*'] } })
generateProseCss()
generateBrowserCss()
generateTailwindConfig('component.tailwind.config.ts', { content: { files: ['!../../**/*.stories.*'] } })
generateComponentCss()
compileGeneratedToDist()
copySrcToDist()
injectFilesIntoIndex()
log('Done!')
