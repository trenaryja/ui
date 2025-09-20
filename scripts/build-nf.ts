import fs from 'fs'
import path from 'path'
import { dataDir, log } from './utils'

const glyphsFile = path.join(dataDir, 'glyphnames.json')
const jsonUrl = 'https://raw.githubusercontent.com/ryanoasis/nerd-fonts/master/glyphnames.json'

const downloadGlyphs = async () => {
	log('Downloading glyphnames.json...')
	const res = await fetch(jsonUrl)
	if (!res.ok) throw new Error(`Failed to fetch glyphnames.json: ${res.status}`)
	const json = JSON.parse(await res.text())
	delete json.METADATA
	fs.writeFileSync(glyphsFile, JSON.stringify(json, null, 2), 'utf-8')
	log('Saved glyphnames.json')
}

await downloadGlyphs()
log('Done!')
