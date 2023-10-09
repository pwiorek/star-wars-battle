import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceSelectorComponent } from "../../components/resource-selector/resource-selector.component";
import { MatButtonModule } from "@angular/material/button";
import { Resource } from "../../utils/types";
import { Router } from "@angular/router";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { TitleStarWarsBattleComponent } from "../../components/title-star-wars-battle/title-star-wars-battle.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ResourceSelectorComponent, MatButtonModule, MatSnackBarModule, TitleStarWarsBattleComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  public selectedResource: Resource;

  constructor(
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  public selectResource(resource: Resource) {
    this.selectedResource = resource;
  }

  public navigateToGame() {
    if (!this.selectedResource) {
      this.snackbar.open('Select resource!', '', { duration: 2000 });
      return;
    }

    this.router.navigate(['game'], { queryParams: { resource: this.selectedResource } });
  }
}
