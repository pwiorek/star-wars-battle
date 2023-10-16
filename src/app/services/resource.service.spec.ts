import { TestBed } from '@angular/core/testing';

import { ResourceService } from './resource.service';
import { HttpClient } from "@angular/common/http";
import { Creature } from "@models/creature.model";
import { Starship } from "@models/starship.model";

describe('ResourceService', () => {
  let service: ResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: {}
        }
      ]
    });
    service = TestBed.inject(ResourceService);
  });

  describe('getResourcesWithCommonProperties', () => {
    it('should return Creatures with common properties', () => {
      const resource1: Creature = { name: 'Luke Skywalker', height: 172, mass: 77 };
      const resource2: Creature = { name: 'R2-D2', height: 96, mass: NaN };

      const result = service.getResourcesWithCommonProperties({ resource1, resource2 });

      expect(result.resource1).toEqual({ name: 'Luke Skywalker', height: 172 });
      expect(result.resource2).toEqual({ name: 'R2-D2', height: 96 });
    })

    it('should return Starships with common properties', () => {
      const resource1: Starship = {
        name: "Naboo Royal Starship",
        crew: 8,
        hyperdrive_rating: 1,
        cargo_capacity: NaN,
        length: 76,
        cost_in_credits: NaN,
        max_atmosphering_speed: 920,
        passengers: NaN,
        MGLT: NaN
      }

      const resource2: Starship = {
        name: "J-type diplomatic barge",
        crew: 5,
        hyperdrive_rating: 0,
        cargo_capacity: NaN,
        length: 39,
        cost_in_credits: 2000000,
        max_atmosphering_speed: 2000,
        passengers: 10,
        MGLT: NaN
      };

      const result = service.getResourcesWithCommonProperties({ resource1, resource2 });

      expect(result.resource1).toEqual({
        name: "Naboo Royal Starship",
        crew: 8,
        hyperdrive_rating: 1,
        length: 76,
        max_atmosphering_speed: 920
      });

      expect(result.resource2).toEqual({
        name: "J-type diplomatic barge",
        crew: 5,
        hyperdrive_rating: 0,
        length: 39,
        max_atmosphering_speed: 2000
      });
    })

    it('should return object with only name if there is no common properties', () => {
      const resource1: Creature = { name: 'Luke Skywalker', height: NaN, mass: 77 };
      const resource2: Creature = { name: 'R2-D2', height: 96, mass: NaN };

      const result = service.getResourcesWithCommonProperties({ resource1, resource2 });

      expect(result.resource1).toEqual({ name: 'Luke Skywalker' });
      expect(result.resource2).toEqual({ name: 'R2-D2' });
    })
  });

  describe('getWinningLosingSpecs', () => {
    it('should correctly calculate winning and losing specs', () => {
      const resource1: Starship = {
        name: "Naboo Royal Starship",
        crew: 8,
        hyperdrive_rating: 1,
        cargo_capacity: NaN,
        length: 76,
        cost_in_credits: NaN,
        max_atmosphering_speed: 920,
        passengers: NaN,
        MGLT: NaN
      }

      const resource2: Starship = {
        name: "J-type diplomatic barge",
        crew: 5,
        hyperdrive_rating: 0,
        cargo_capacity: NaN,
        length: 39,
        cost_in_credits: 2000000,
        max_atmosphering_speed: 2000,
        passengers: 10,
        MGLT: NaN
      };

      const result = service.getWinningLosingSpecs({ resource1, resource2 });

      expect(result.resource1).toEqual({ winning: ['crew', 'hyperdrive_rating', 'length'], losing: ['max_atmosphering_speed']});
      expect(result.resource2).toEqual({ winning: ['max_atmosphering_speed'], losing: ['crew', 'hyperdrive_rating', 'length']});
    })

    it('should handle equal values correctly', () => {
      const resource1: Creature = { name: 'Luke Skywalker', height: 96, mass: 77 };
      const resource2: Creature = { name: 'R2-D2', height: 96, mass: 77 };

      const result = service.getWinningLosingSpecs({ resource1, resource2 });

      expect(result.resource1).toEqual({ winning: [], losing: [] });
      expect(result.resource2).toEqual({ winning: [], losing: [] });
    })
  });

  describe('getWinningResource', () => {
    it('should correctly return winning resource', () => {
      const resource1: Starship = {
        name: "Naboo Royal Starship",
        crew: 8,
        hyperdrive_rating: 1,
        cargo_capacity: NaN,
        length: 76,
        cost_in_credits: NaN,
        max_atmosphering_speed: 920,
        passengers: NaN,
        MGLT: NaN
      }

      const resource2: Starship = {
        name: "J-type diplomatic barge",
        crew: 5,
        hyperdrive_rating: 0,
        cargo_capacity: NaN,
        length: 39,
        cost_in_credits: 2000000,
        max_atmosphering_speed: 2000,
        passengers: 10,
        MGLT: NaN
      };

      const result = service.getWinningResource({ resource1, resource2 });

      expect(result).toEqual(resource1);
    })

    it('should return null on draw', () => {
      const resource1: Creature = { name: 'Luke Skywalker', height: 96, mass: 77 };
      const resource2: Creature = { name: 'R2-D2', height: 96, mass: 77 };

      const result = service.getWinningResource({ resource1, resource2 });

      expect(result).toBeNull();
    })
  });
});
