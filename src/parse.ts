// Route schemas coerce ids to numbers. parseInt still matches the previous
// JavaScript, including `parseInt(value) || fallback` treating 0 as missing.
export function asInt (value: string | number): number {
  return parseInt(String(value))
}

export function pageArg (value: string | number | undefined, fallback: number): number {
  return parseInt(String(value)) || fallback
}
