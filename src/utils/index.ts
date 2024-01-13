import { clsx, type ClassValue } from 'clsx/lite'
import { twMerge } from 'tailwind-merge'

export interface Nothing {}

export type AnyOther<T> = T & Nothing

export type ChromaColor = string | number | chroma.Color

export type Prettify<T> = {
  [K in keyof T]: T[K]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
