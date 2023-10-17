import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EMPTY, expand, map, Observable } from "rxjs";

import { Creature, CreatureResponse } from "@models/creature.model";
import { Starship, StarshipResponse } from "@models/starship.model";
import { environment } from "@environment";
import { ResourceType } from "@utils/types";
import { PageResourceResponse } from "@models/page-resource.model";

@Injectable({
  providedIn: 'root'
})
export class ResourceApiService {
  constructor(
    private http: HttpClient
  ) { }

  public getCreature(id: number): Observable<Creature> {
    return this.http.get<CreatureResponse>(`${environment.baseUrl}/people/${id}`).pipe(
      map(creature => ({
        name: creature.name,
        height: parseInt(creature.height),
        mass: parseInt(creature.height),
        birth_year: parseInt(creature.height),
      }))
    )
  }

  public getStarship(id: number): Observable<Starship> {
    return this.http.get<StarshipResponse>(`${environment.baseUrl}/starships/${id}`).pipe(
      map(starship => ({
        name: starship.name,
        crew: parseInt(starship.crew),
        hyperdrive_rating: parseInt(starship.hyperdrive_rating),
        cargo_capacity: parseInt(starship.cargo_capacity),
        length: parseInt(starship.length),
        cost_in_credits: parseInt(starship.cost_in_credits),
        max_atmosphering_speed: parseInt(starship.max_atmosphering_speed),
        passengers: parseInt(starship.passengers),
        MGLT: parseInt(starship.MGLT),
      }))
    )
  }

  /**
   * Workaround to get the right IDs from API since they are not in ascending order.
   */
  public getAllResourceIds(resourceType: ResourceType): Observable<number[]> {
    const resource = resourceType === 'starship' ? 'starships' : 'people';
    const url = `${environment.baseUrl}/${resource}/?page=1`;

    return this.getResourcesFromUrl(url).pipe(
      expand(res => {
        if (res.next) return this.getResourcesFromUrl(res.next);
        return EMPTY;
      }),
      map(res => res.results.map(resource => this.getIdFromSWAPIEndpoint(resource.url)))
    )
  }

  private getResourcesFromUrl(url: string): Observable<PageResourceResponse> {
    return this.http.get<PageResourceResponse>(url);
  }

  private getIdFromSWAPIEndpoint(url: string): number {
    return Number(url.split('/').slice(-2)[0]);
  }

}
