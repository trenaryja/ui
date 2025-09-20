import path from 'path'
import { fileURLToPath } from 'url'

export const scriptDir = path.dirname(fileURLToPath(import.meta.url))

export const distDir = path.join(scriptDir, '../dist')
export const distCssDir = path.join(distDir, './css')

export const srcDir = path.join(scriptDir, '../src')
export const srcCssDir = path.join(srcDir, './css')
export const dataDir = path.join(srcDir, './data')
export const generatedDir = path.join(srcDir, './_generated')

export const log = (m: string) => console.log(`▶ ${m}`)
