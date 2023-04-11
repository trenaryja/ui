// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Nothing {}

export type AnyOther<T> = T & Nothing
