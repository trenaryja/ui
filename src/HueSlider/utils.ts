import chroma from 'chroma-js'
import { ChromaColor } from '../utils'

export const hueColors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00']

export const getHue = (value: ChromaColor | undefined) => {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  return chroma(value).get('hsl.h')
}
