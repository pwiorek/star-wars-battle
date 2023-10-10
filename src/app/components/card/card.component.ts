import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { ResourceKey } from "../../utils/types";
import { Creature } from "../../models/creature.model";
import { Starship } from "../../models/starship.model";
import { SnakeCaseToTitleCasePipe } from "../../pipes/snake-case-to-title-case.pipe";
import { IsInArrayPipe } from "../../pipes/is-in-array.pipe";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, SnakeCaseToTitleCasePipe, IsInArrayPipe],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  @Input() resource: Creature | Starship;
  @Input() highlightedSpecs: ResourceKey[] = [];
  @Input() isWinningCard: boolean;

  public resourceSpecs: { key: string, value: string }[] = []

  ngOnInit(): void {
    this.resourceSpecs = this.mapResourceToSpecs(this.resource);
  }

  private mapResourceToSpecs(resource: Creature | Starship): { key: string, value: string }[] {
    return Object.entries(resource)
      .filter(([key, _]) => key !== 'name')
      .map(([key, value]) => ({ key, value }));
  }
}
