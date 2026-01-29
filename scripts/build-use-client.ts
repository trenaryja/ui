import fs from 'fs'
import path from 'path'
import { distDir, log } from './utils'

const file = path.join(distDir, 'index.js')
const content = fs.readFileSync(file, 'utf-8')
fs.writeFileSync(file, `"use client";\n${content}`)
log(`Prepended "use client" to dist/index.js`)
