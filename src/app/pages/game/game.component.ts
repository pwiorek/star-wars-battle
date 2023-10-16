import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "@components/loading/loading.component";
import { CardComponent } from "@components/card/card.component";
import { Creature } from "../../models/creature.model";
import { Starship } from "../../models/starship.model";
import { ResourceApiService } from "../../services/resource-api.service";
import { ActivatedRoute } from "@angular/router";
import { Resource } from "../../utils/types";
import { GameService } from "../../services/game.service";
import { forkJoin, Observable, of } from "rxjs";
import { TitleStarWarsBattleComponent } from "@components/title-star-wars-battle/title-star-wars-battle.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, LoadingComponent, CardComponent, TitleStarWarsBattleComponent,],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {
  private readonly resourceType: Resource = this.getResourceTypeFromUrl();

  public readonly score$ = this.gameService.getScore$();
  public starship1: Partial<Starship>;
  public starship2: Partial<Starship>;

  constructor(
    private gameService: GameService,
    private resourceApi: ResourceApiService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.getResources();
  }

  private getResourceTypeFromUrl(): Resource {
    return this.route.snapshot.queryParams['resource'];
  }

  private getRandomResource(): Observable<Starship | Creature> {
    if (this.resourceType === 'starship') {
      return this.resourceApi.getStarship(this.gameService.getRandomStarshipId());
    }

    if (this.resourceType === 'creature') {
      return this.resourceApi.getCreature(this.gameService.getRandomCreatureId());
    }

    return of();
  }

  private getResources(): void {
    forkJoin({
      starship1: this.resourceApi.getStarship(this.gameService.getRandomStarshipId()),
      starship2: this.resourceApi.getStarship(this.gameService.getRandomStarshipId())
    }).subscribe(res => {
      const resources = this.gameService.getResourcesWithCommonProperties({ resource1: res.starship1, resource2: res.starship2 })
      this.starship1 = resources.resource1;
      this.starship2 = resources.resource2;
      this.cd.markForCheck();
    })
  }

}
