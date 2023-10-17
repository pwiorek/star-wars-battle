import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Score } from "@models/score.model";
import { ResourceService } from "@services/resource.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly score$ = new BehaviorSubject<Score>({ player1: 0, player2: 0 });

  constructor(
    private resourceService: ResourceService
  ) { }

  public initGame(): void {
    /**
     * Due to the way that API is built (IDs are not ascending and there is no other way to get them) IDs are
     * fetched on game initialization
     */
    this.resourceService.getAllResourcesIds();
  }

  public addPointForPlayer1(): void {
    this.score$.next({ player1: ++this.score$.value.player1, player2: this.score$.value.player2 });
  }

  public addPointForPlayer2(): void {
    this.score$.next({ player1: this.score$.value.player1, player2: ++this.score$.value.player2 })
  }

  public getScore$(): Observable<Score> {
    return this.score$.asObservable();
  }
}
