import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";

import { TitleStarWarsBattleComponent } from "@components/title-star-wars-battle/title-star-wars-battle.component";
import { ResourceSelectorComponent } from "@components/resource-selector/resource-selector.component";
import { ResourceType } from "@utils/types";
import { ResourceService } from "@services/resource.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ResourceSelectorComponent, MatButtonModule, MatSnackBarModule, TitleStarWarsBattleComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  public selectedResource: ResourceType;

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private resourceService: ResourceService
  ) {}

  public selectResource(resource: ResourceType) {
    this.selectedResource = resource;
  }

  public navigateToGame() {
    if (!this.selectedResource) {
      this.snackbar.open('Select resource!', '', { duration: 2000 });
      return;
    }

    if (!this.areSomeResourcesFetched(this.selectedResource)) {
      this.snackbar.open('Resources are not fetched yet... Please wait a moment', '', { duration: 2000 });
      return;
    }

    this.router.navigate(['game'], { queryParams: { resource: this.selectedResource } });
  }

  private areSomeResourcesFetched(resourceType: ResourceType): boolean {
    return this.resourceService.getRandomResourceId(resourceType) !== -1;
  }
}
