export interface NoopFunction {
  (): void
  (arg0): void
}

export const noopFunction: NoopFunction = () => {
  /* noop */
}
