import { z } from 'zod/v4'

export function fn<T extends z.ZodType, Result>(schema: T, cb: (input: z.output<T>) => Result) {
  const result = (input: z.input<T>) => {
    const parsed = schema.parse(input)
    return cb(parsed)
  }

  result.schema = schema
  return result
}
