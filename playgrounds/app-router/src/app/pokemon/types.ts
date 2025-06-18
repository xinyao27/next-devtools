export interface Pokemon {
  name: string
  url: string
}

export interface PokemonDetail {
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  height: number
  id: number
  name: string
  sprites: {
    back_default: string
    front_default: string
  }
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  types: Array<{
    type: {
      name: string
    }
  }>
  weight: number
}
