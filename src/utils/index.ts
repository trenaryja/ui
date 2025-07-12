import { clsx, type ClassValue } from 'clsx'
import daisyThemes from 'daisyui/theme/object'
import { twMerge } from 'tailwind-merge'
import { OmitIndexSignature } from 'type-fest'

export * from './types'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export type DaisyThemeName = keyof OmitIndexSignature<typeof daisyThemes>
