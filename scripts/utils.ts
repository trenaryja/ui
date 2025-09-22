import fs from 'fs'
import path from 'path'
import { Config } from 'tailwindcss'
import { fileURLToPath } from 'url'

export const scriptDir = path.dirname(fileURLToPath(import.meta.url))

export const distDir = path.join(scriptDir, '../dist')
export const distCssDir = path.join(distDir, './css')

export const srcDir = path.join(scriptDir, '../src')
export const srcCssDir = path.join(srcDir, './css')
export const dataDir = path.join(srcDir, './data')
export const generatedDir = path.join(srcDir, './_generated')

export const log = (m: string) => console.log(`▶ ${m}`)

export const generateTailwindConfig = (fileName: string, config: Config) => {
	const configFile = path.join(generatedDir, fileName)
	fs.writeFileSync(
		configFile,
		`import type { Config } from 'tailwindcss'; export default ${JSON.stringify(config, null, 2)} satisfies Config`,
		'utf-8',
	)
	log(`Generated ${fileName}`)
}
