import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { forkJoin, map } from "rxjs";

import { TitleStarWarsBattleComponent } from "@components/title-star-wars-battle/title-star-wars-battle.component";
import { LoadingComponent } from "@components/loading/loading.component";
import { CardComponent } from "@components/card/card.component";
import { GameService } from "@services/game.service";
import { Resource, ResourceType } from "@utils/types";
import { ResourceService } from "@services/resource.service";
import { HighlightSpecs } from "@models/highlight-specs.model";
import { Resources } from "@models/resources.model";
import { BattleResultComponent } from "@components/battle-result/battle-result.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, LoadingComponent, CardComponent, TitleStarWarsBattleComponent, BattleResultComponent, MatButtonModule, RouterLink,],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {
  private readonly resourceType: ResourceType = this.getResourceTypeFromUrl();

  public readonly score$ = this.gameService.getScore$();
  public player1Resource: Partial<Resource> | undefined;
  public player2Resource: Partial<Resource> | undefined;
  public highlightedCardSpecs: Resources<HighlightSpecs>;

  constructor(
    private gameService: GameService,
    private resourceService: ResourceService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.getResources();
  }

  private getResourceTypeFromUrl(): ResourceType {
    return this.route.snapshot.queryParams['resource'];
  }

  private getResources(): void {
    forkJoin({
      resource1: this.resourceService.getRandomResource$(this.resourceType),
      resource2: this.resourceService.getRandomResource$(this.resourceType)
    }).pipe(
      map(({ resource1, resource2 }) => this.resourceService.getResourcesWithCommonProperties(resource1, resource2))
    ).subscribe(({ resource1, resource2 }) => {
      this.player1Resource = resource1;
      this.player2Resource = resource2;
      this.highlightedCardSpecs = this.resourceService.getWinningLosingSpecs(resource1, resource2)
      this.updateScore(this.highlightedCardSpecs.resource1.winning.length, this.highlightedCardSpecs.resource2.winning.length);
      this.cd.markForCheck();
    });
  }

  private updateScore(numOfWinningPropsResource1: number, numOfWinningPropsResource2: number) {
    if (numOfWinningPropsResource1 === numOfWinningPropsResource2) return;

    numOfWinningPropsResource1 > numOfWinningPropsResource2 ? this.gameService.addPointForPlayer1()
                                                            : this.gameService.addPointForPlayer2();
  }

  public playAgain(): void {
    this.player1Resource = undefined;
    this.player2Resource = undefined;
    this.cd.markForCheck();
    this.getResources();
  }
}
