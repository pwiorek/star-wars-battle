import { Injectable } from '@angular/core';
import { finalize, Observable } from "rxjs";
import { ResourceApiService } from "@services/resource-api.service";
import { ResourceType, ResourceKey, Resource } from "@utils/types";
import { HighlightSpecs } from "@models/highlight-specs.model";
import { PartialResources, Resources } from "@models/resources.model";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private creatureIds: number[] = [];
  private starshipIds: number[] = [];

  constructor(
    private resourceApi: ResourceApiService
  ) { }

  public getRandomCreatureId(): number {
    const randomIndex = Math.floor(Math.random() * this.creatureIds.length);
    return this.creatureIds[randomIndex];
  }

  public getRandomStarshipId(): number {
    const randomIndex = Math.floor(Math.random() * this.starshipIds.length);
    return this.starshipIds[randomIndex];
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
  public getResourcesWithCommonProperties<T extends Resource>(resources: Resources<T>): PartialResources<T> {
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

  public getRandomResource$(resourceType: ResourceType): Observable<Resource> {
    switch (resourceType) {
      case "creature": return this.resourceApi.getCreature(this.getRandomCreatureId());
      case "starship": return this.resourceApi.getStarship(this.getRandomStarshipId());
    }
  }

  public getWinningLosingSpecs<T extends Resource>(resources: PartialResources<T>): Resources<HighlightSpecs> {
    const { resource1, resource2 } = resources;
    const resource1Specs: HighlightSpecs = { winning: [], losing: [] };

    for (let key in resource1) {
      if (key === 'name') continue;

      if (resource1[key] > resource2[key]) {
        resource1Specs.winning.push(key as ResourceKey);
      } else if (resource1[key] < resource2[key]) {
        resource1Specs.losing.push(key as ResourceKey)
      }
    }

    const resource2Specs: HighlightSpecs = {
      winning: [...resource1Specs.losing],
      losing: [...resource1Specs.winning]
    }

    return { resource1: resource1Specs, resource2: resource2Specs };
  }

  public getWinningResource<T extends Resource>(resources: PartialResources<T>): Partial<Resource> | null {
    const { resource1, resource2 } = resources;
    const score = [0, 0];

    for (let key in resource1) {
      if (key === 'name') continue;

      if (resource1[key] > resource2[key]) ++score[0];
      else if (resource1[key] < resource2[key]) ++score[1];
    }

    if (score[0] === score[1]) return null;
    return score[0] > score[1] ? resource1 : resource2;
  }
}
