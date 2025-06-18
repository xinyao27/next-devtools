'use client'

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import type { PokemonDetail } from './types'

interface PokemonDetailProps {
  pokemon: PokemonDetail
}

export function PokemonDetails({ pokemon }: PokemonDetailProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-lg border p-4 text-center hover:bg-gray-100">
          <img
            alt={pokemon.name}
            className="mx-auto"
            height={120}
            src={pokemon.sprites.front_default}
            width={120}
          />
          <h2 className="mt-2 capitalize">{pokemon.name}</h2>
        </button>
      </DialogTrigger>
      <DialogContent className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6">
        <DialogTitle className="mb-4 text-xl font-bold capitalize">{pokemon.name}</DialogTitle>
        <DialogDescription>{pokemon.id}</DialogDescription>
        <div className="mb-4 flex justify-center gap-4">
          <img
            alt={`${pokemon.name} front`}
            className="h-32 w-32"
            src={pokemon.sprites.front_default}
          />
          {pokemon.sprites.back_default ? (
            <img
              alt={`${pokemon.name} back`}
              className="h-32 w-32"
              src={pokemon.sprites.back_default}
            />
          ) : null}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-bold">Basic Info</h3>
            <p>Height: {pokemon.height / 10}m</p>
            <p>Weight: {pokemon.weight / 10}kg</p>
          </div>

          <div>
            <h3 className="mb-2 font-bold">Types</h3>
            <div className="flex gap-2">
              {pokemon.types.map(({ type }) => (
                <span
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm"
                  key={type.name}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-bold">Abilities</h3>
            <div className="flex gap-2">
              {pokemon.abilities.map(({ ability }) => (
                <span
                  className="rounded-full bg-green-100 px-3 py-1 text-sm"
                  key={ability.name}
                >
                  {ability.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-bold">Stats</h3>
            {pokemon.stats.map(({ base_stat, stat }) => (
              <div
                className="mb-2"
                key={stat.name}
              >
                <div className="mb-1 flex justify-between">
                  <span>{stat.name}</span>
                  <span>{base_stat}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-blue-600"
                    style={{ width: `${(base_stat / 255) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
