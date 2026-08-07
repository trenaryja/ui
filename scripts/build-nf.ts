import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { dataDir, log, scriptDir } from './utils'

// Pinned so builds are reproducible and offline-capable.
// Bump with `bun run build:nf --latest`, which rewrites this line for you.
const pinnedVersion = 'v3.5.0'

const glyphsFile = path.join(dataDir, 'glyphnames.json')
const selfFile = path.join(scriptDir, 'build-nf.ts')
const glyphsUrl = (ref: string) => `https://raw.githubusercontent.com/ryanoasis/nerd-fonts/${ref}/glyphnames.json`
const latestReleaseUrl = 'https://api.github.com/repos/ryanoasis/nerd-fonts/releases/latest'

const resolveLatestVersion = async () => {
	log('Resolving latest nerd-fonts release...')
	const res = await fetch(latestReleaseUrl)
	if (!res.ok) throw new Error(`Failed to resolve latest release: ${res.status}`)
	const { tag_name: tagName }: { tag_name: string } = await res.json()
	return tagName
}

const rewritePin = (version: string) => {
	const source = fs.readFileSync(selfFile, 'utf-8')
	fs.writeFileSync(selfFile, source.replace(/^const pinnedVersion = '.*'$/m, `const pinnedVersion = '${version}'`))
	log(`Pinned to ${version} — commit this alongside the refreshed glyphnames.json`)
}

const downloadGlyphs = async (version: string) => {
	log(`Downloading glyphnames.json @ ${version}...`)
	const res = await fetch(glyphsUrl(version))
	if (!res.ok) throw new Error(`Failed to fetch glyphnames.json: ${res.status}`)
	const json = JSON.parse(await res.text())
	delete json.METADATA
	fs.mkdirSync(path.dirname(glyphsFile), { recursive: true })
	fs.writeFileSync(glyphsFile, JSON.stringify(json, null, 2), 'utf-8')
	execSync(`prettier --write "${glyphsFile}"`, { stdio: 'ignore' })
	log(`Saved ${Object.keys(json).length} glyphs`)
}

const wantsLatest = process.argv.includes('--latest')
const version = wantsLatest ? await resolveLatestVersion() : pinnedVersion

await downloadGlyphs(version)
if (version !== pinnedVersion) rewritePin(version)
log('Done!')
