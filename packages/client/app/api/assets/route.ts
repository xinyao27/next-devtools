import fs from 'node:fs/promises'
import mine from 'mime-types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const u = searchParams.get('u')
  if (!u) {
    return new Response('Missing u query parameter', { status: 400 })
  }

  const file = await fs.readFile(u)
  const type = mine.lookup(u) as string
  return new Response(file, {
    headers: {
      'Content-Type': type,
      'Content-Disposition': `attachment; filename="${u}"`,
    },
  })
}
