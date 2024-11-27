import Link from 'next/link'
import { PokemonDetails } from './pokemon-details'
import type { Pokemon, PokemonDetail } from './types'

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number((await searchParams).page) || 1
  const limit = 12
  const offset = (page - 1) * limit

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`, {
    cache: 'force-cache',
  })
  const { results, count } = await response.json()

  const pokemonDetails = await Promise.all(
    results.map(async (pokemon: Pokemon) => {
      const res = await fetch(pokemon.url, { cache: 'force-cache' })
      return res.json()
    }),
  )

  const totalPages = Math.ceil(count / limit)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Pokemon</h1>
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link className="rounded border px-4 py-2 hover:bg-gray-100" href={`/pokemon?page=${page - 1}`}>
              {'<'}
            </Link>
          )}
          <span className="px-4 py-2">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link className="rounded border px-4 py-2 hover:bg-gray-100" href={`/pokemon?page=${page + 1}`}>
              {'>'}
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {pokemonDetails.map((pokemon: PokemonDetail) => (
          <PokemonDetails key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </div>
  )
}
