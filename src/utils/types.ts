export type Nothing = {}

export type AnyOther<T> = T & Nothing

export type ChromaColor = string | number | chroma.Color
