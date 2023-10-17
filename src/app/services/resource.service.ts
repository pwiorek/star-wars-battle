import { Injectable } from '@angular/core';
import { finalize, Observable } from "rxjs";
import { ResourceApiService } from "@services/resource-api.service";
import { ResourceType, ResourceKey, Resource } from "@utils/types";
import { HighlightSpecs } from "@models/highlight-specs.model";
import { PartialResources, Resources } from "@models/resources.model";
import { Score } from "@models/score.model";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private creatureIds: number[] = [];
  private starshipIds: number[] = [];

  constructor(
    private resourceApi: ResourceApiService
  ) { }

  public getRandomResourceId(resourceType: ResourceType): number {
    const ids = resourceType === 'creature' ? this.creatureIds : this.starshipIds;

    if (ids.length === 0) return -1;

    const randomIndex = Math.floor(Math.random() * ids.length);
    return ids[randomIndex];
  }

  public getAllResourcesIds(): void {
    this.getResourceIds('creature', this.creatureIds);
    this.getResourceIds('starship', this.starshipIds);
  }

  /**
   * Get all possible resource ids. When fetched assign them to sessionStorage.
   * @private
   */
  private getResourceIds(resourceType: ResourceType, idsArray: number[]): void {
    const sessionStorageKey = `${resourceType}Ids`;
    const storedResourceIds = sessionStorage.getItem(sessionStorageKey);
    if (storedResourceIds) {
      idsArray.splice(0, idsArray.length, ...storedResourceIds.split(',').map(id => +id));
      return;
    }

    this.resourceApi.getAllResourceIds(resourceType).pipe(
      finalize(() => sessionStorage.setItem(sessionStorageKey, idsArray.toString()))
    ).subscribe(ids => idsArray.push(...ids));
  }

  /**
   * Method that takes resources of the same type and returns them as Partial with the common properties
   */
  public getResourcesWithCommonProperties<T extends Resource>(resource1: T, resource2: T): PartialResources<T> {
    [resource1, resource2].forEach(resource => {
      for (const key in resource) {
        if (key !== 'name' && (isNaN(resource1[key] as number) || isNaN(resource2[key] as number))) {
          delete resource[key];
        }
      }
    })

    return { resource1, resource2 }
  }

  public getRandomResource$(resourceType: ResourceType): Observable<Resource> {
    switch (resourceType) {
      case 'creature': return this.resourceApi.getCreature(this.getRandomResourceId('creature'));
      case 'starship': return this.resourceApi.getStarship(this.getRandomResourceId('starship'));
    }
  }

  public getWinningLosingSpecs<T extends Partial<Resource>>(resource1: T, resource2: T): Resources<HighlightSpecs> {
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

  public getWinningResource<T extends Partial<Resource>>(resource1: T, resource2: T): Partial<Resource> | null {
    const score: Score = { player1: 0, player2: 0 };

    for (let key in resource1) {
      if (key === 'name') continue;

      if (resource1[key] > resource2[key]) ++score.player1;
      else if (resource1[key] < resource2[key]) ++score.player2;
    }

    if (score.player1 === score.player2) return null;
    return score.player1 > score.player2 ? resource1 : resource2;
  }
}
