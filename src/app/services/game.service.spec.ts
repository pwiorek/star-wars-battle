import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import { HttpClient } from "@angular/common/http";
import { Creature } from "../models/creature.model";
import { Starship } from "../models/starship.model";

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: {}
        }
      ]
    });
    service = TestBed.inject(GameService);
  });

  describe('should accurately manage scoring', () => {
    let player1Score: number;
    let player2Score: number;

    beforeEach(() => {
      player1Score = service.getScore().player1;
      player2Score = service.getScore().player2;
    });

    it('initial scores should be 0', () => {
      expect(player1Score).toBe(0);
      expect(player2Score).toBe(0);
    });

    it('should correctly add points for player 1', () => {
      service.addPointForPlayer1();
      expect(service.getScore().player1).toBe(player1Score + 1);
      expect(service.getScore().player2).toBe(player2Score);
    });

    it('should correctly add points for player 2', () => {
      service.addPointForPlayer2();
      expect(service.getScore().player1).toBe(player1Score);
      expect(service.getScore().player2).toBe(player2Score + 1);
    });
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
  })
});
