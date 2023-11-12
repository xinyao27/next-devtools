export async function GET(_: Request, { params }: { params: { name: string } }) {
  try {
    const name = params.name
    // Get NPM data
    const npmRegistryUrl = 'https://registry.npmjs.org'
    const npmUrl = `${npmRegistryUrl}/${name}`
    const npmResponse = await fetch(npmUrl, { cache: 'force-cache' })
    const npmData = await npmResponse.json()
    if (npmData.repository?.url.startsWith('git+')) {
      npmData.repository.url = npmData.repository.url.slice(4)
    }

    // Get GitHub data
    const githubUrl = npmData.repository?.url
    const githubUser = githubUrl?.split('/')[3]
    const githubRepo = githubUrl?.split('/')[4]?.split('.git')[0]
    const githubApiUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}`
    const githubResponse = await fetch(githubApiUrl, { cache: 'force-cache' })
    const githubData = await githubResponse.json()

    return Response.json({ ...npmData, ...githubData })
  }
  catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
