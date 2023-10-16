import { Injectable } from '@angular/core';
import { ResourceApiService } from "./resource-api.service";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import { Score } from "@models/score.model";
import { Creature } from "@models/creature.model";
import { Starship } from "@models/starship.model";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly score: [number, number] = [0, 0];
  private readonly score$ = new BehaviorSubject<Score>({ player1: 0, player2: 0 });

  private lastDrawnId: number;

  private creatureIds: number[] = [];
  private starshipIds: number[] = [];

  constructor(
    private resourceApi: ResourceApiService
  ) { }

  public initGame(): void {
    this.getAllResourcesIds();
  }

  public getRandomCreatureId(): number {
    const randomIndex = Math.floor(Math.random() * this.creatureIds.length);
    this.lastDrawnId = this.creatureIds[randomIndex];
    return this.creatureIds[randomIndex];
  }

  public getRandomStarshipId(): number {
    const randomIndex = Math.floor(Math.random() * this.starshipIds.length);
    this.lastDrawnId = this.starshipIds[randomIndex];
    return this.starshipIds[randomIndex];
  }

  public addPointForPlayer1(): void {
    this.score[0]++;
  }

  public addPointForPlayer2(): void {
    this.score[1]++;
  }

  public getScore(): Score {
    return {
      player1: this.score[0],
      player2: this.score[1],
    }
  }

  public getScore$(): Observable<Score> {
    return this.score$.asObservable();
  }


  public getAllResourcesIds(): void {
    this.getAllCreatureIds();
    this.getAllStarshipIds();
  }

  /**
   * The way to get available creature ids.
   * Get all possible creature ids. When fetched assign them to sessionStorage.
   * @private
   */
  private getAllCreatureIds(): void {
    const storedCreatureIds = sessionStorage.getItem('creatureIds');
    if (storedCreatureIds) {
      this.creatureIds = storedCreatureIds.split(',').map(id => +id) ?? [];
      return;
    }

    this.resourceApi.getAllCreatureIds().pipe(
      finalize(() => sessionStorage.setItem('creatureIds', this.creatureIds.toString()))
    ).subscribe(ids => this.creatureIds = [...this.creatureIds, ...ids]);
  }

  /**
   * The way to get available starship ids.
   * Get all possible starship ids. When fetched assign them to sessionStorage.
   * @private
   */
  private getAllStarshipIds(): void {
    const storedStarshipIds = sessionStorage.getItem('starshipIds');
    if (storedStarshipIds) {
      this.starshipIds = storedStarshipIds.split(',').map(id => +id) ?? [];
      return;
    }

    this.resourceApi.getAllStarshipIds().pipe(
      finalize(() => sessionStorage.setItem('starshipIds', this.starshipIds.toString()))
    ).subscribe(ids => this.starshipIds = [...this.starshipIds, ...ids]);
  }

  /**
   * Method that takes resources of the same type and returns them as Partial with the common properties
   */
  public getResourcesWithCommonProperties<T extends Creature | Starship>(resources: { resource1: T, resource2: T }): { resource1: Partial<T>, resource2: Partial<T> } {
    const { resource1, resource2 } = resources;
    const resource1Copy: Partial<T> = { name: resource1.name } as T;
    const resource2Copy: Partial<T> = { name: resource2.name } as T;

    Object.entries(resource1).forEach(([key, value]) => {
      if (!isNaN(value) && !isNaN((resource2 as any)[key])) {
        (resource1Copy as any)[key] = value;
        (resource2Copy as any)[key] = (resource2 as any)[key];
      }
    })

    return { resource1: resource1Copy, resource2: resource2Copy };
  }
}
