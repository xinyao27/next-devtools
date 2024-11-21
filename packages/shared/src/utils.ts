export function removeVersionPrefix(version: string) {
  return version.replace(/^[<=>^~]*\s*/, '')
}

export function prettySize(size: number) {
  const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB']
  let i = 0
  while (size >= 1024 && i < sizes.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)} ${sizes[i]}`
}
