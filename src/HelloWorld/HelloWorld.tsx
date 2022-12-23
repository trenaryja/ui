export type HelloWorldProps = {
  value?: string
}

export const HelloWorld = ({ value = 'Hello World' }: HelloWorldProps) => <h1>{value}</h1>
