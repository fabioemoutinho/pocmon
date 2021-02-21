export interface Pokemon {
  id: number;
  name: string;
  captureRate: number;
  description: string;
  seen: number;
  own: number;
}

export interface PokemonResponse {
  id: number;
  name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  capture_rate: number;
  description: string;
}
