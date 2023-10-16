export interface Starship {
  name: string;
  cost_in_credits: number;
  length: number;
  crew: number;
  passengers: number;
  max_atmosphering_speed: number;
  hyperdrive_rating: number;
  MGLT: number;
  cargo_capacity: number;
}

export interface StarshipResponse {
  name: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cargo_capacity: string;
  url: string;
}
