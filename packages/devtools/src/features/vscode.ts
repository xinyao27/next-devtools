export async function openInVscode(options: {
  path: string
  line?: number | string
  column?: number | string
}) {
  if (!options.path) {
    throw new Error('Path is required')
  }

  const { execa } = await import('execa')
  if (options?.line !== undefined && options?.column !== undefined) {
    execa('code', ['-g', `${options.path}:${options.line}:${options.column}`], { stdio: 'inherit' })
  }
  else {
    execa('code', [options.path], { stdio: 'inherit' })
  }
}
