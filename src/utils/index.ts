// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Nothing {}

export type AnyOther<T> = T & Nothing

export type ChromaColor = string | number | chroma.Color

export type Prettify<T> = {
  [K in keyof T]: T[K]
}
