import { Creature } from "@models/creature.model";
import { Starship } from "@models/starship.model";

export type Resource = Creature | Starship;
export type ResourceType = 'creature' | 'starship';
export type ResourceKey = 'cost_in_credits' | 'length' | 'crew' | 'passengers' | 'max_atmosphering_speed' |
                          'hyperdrive_rating' | 'MGLT' | 'cargo_capacity' | 'height' | 'mass' | 'birth_year';
