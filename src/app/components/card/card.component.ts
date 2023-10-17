import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { SnakeCaseToTitleCasePipe } from "@pipes/snake-case-to-title-case.pipe";
import { IsInArrayPipe } from "@pipes/is-in-array.pipe";
import { Resource } from "@utils/types";
import { HighlightSpecs } from "@models/highlight-specs.model";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, SnakeCaseToTitleCasePipe, IsInArrayPipe],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  @Input() resource: Partial<Resource>;
  @Input() highlightedSpecs: HighlightSpecs;

  public resourceSpecs: { key: string, value: string | number }[] = []

  ngOnInit(): void {
    this.resourceSpecs = this.mapResourceToSpecs(this.resource);
  }

  private mapResourceToSpecs(resource: Partial<Resource>): { key: string, value: string | number }[] {
    return Object.entries(resource)
      .filter(([key]) => key !== 'name')
      .map(([key, value]) => ({ key, value }));
  }

  public trackByKey(index: number, item: { key: string, value: string | number }) {
    return item.key;
  }
}
