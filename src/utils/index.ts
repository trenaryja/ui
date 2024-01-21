import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface Nothing {}

export type AnyOther<T> = T & Nothing

export type ChromaColor = string | number | chroma.Color

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
