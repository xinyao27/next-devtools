export interface Pokemon {
  name: string
  url: string
}

export interface PokemonDetail {
  id: number
  name: string
  sprites: {
    front_default: string
    back_default: string
  }
  height: number
  weight: number
  types: Array<{
    type: {
      name: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
}
