import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, mergeMap, Observable, of } from "rxjs";
import { Creature, CreatureResponse } from "../models/creature.model";
import { environment } from "../../environments/environment";
import { Starship, StarshipResponse } from "../models/starship.model";

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
   * Workaround to get right ids from API. There are not in ascending order.
   */
  public getAllCreatureIds(page = 1): Observable<number[]> {
    const params = new HttpParams({ fromObject: { page }} );
    return this.http.get<{ next: string, results: CreatureResponse[] }>(`${environment.baseUrl}/people`, { params }).pipe(
      mergeMap(({ next, results }) => {
        if (next) {
          return of(
            of(results.map(creature => this.getIdFromSWAPIEndpoint(creature.url))),
            this.getAllCreatureIds(++page)
          ).pipe(
            mergeMap(arr => arr),
          );
        }

        return of(results.map(creature => this.getIdFromSWAPIEndpoint(creature.url)))
      })
    )
  }

  /**
   * Workaround to get right ids from API. There are not in ascending order.
   */
  public getAllStarshipIds(page = 1): Observable<number[]> {
    const params = new HttpParams({ fromObject: { page } });
    return this.http.get<{ next: string, results: StarshipResponse[] }>(`${environment.baseUrl}/starships`, { params }).pipe(
      mergeMap(({ next, results }) => {
        if (next) {
          return of(
            of(results.map(starship => this.getIdFromSWAPIEndpoint(starship.url))),
            this.getAllStarshipIds(++page)
          ).pipe(
            mergeMap(arr => arr)
          );
        }

        return of(results.map(starship => this.getIdFromSWAPIEndpoint(starship.url)))
      })
    )
  }

  private getIdFromSWAPIEndpoint(url: string): number {
    return Number(url.split('/').slice(-2)[0]);
  }

}
