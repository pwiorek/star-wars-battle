import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceType } from "@utils/types";

@Component({
  selector: 'app-resource-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-selector.component.html',
  styleUrls: ['./resource-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceSelectorComponent {
  @Output() onResourceSelected = new EventEmitter<ResourceType>();
  public selectedResource: ResourceType;

  public selectResource(resource: ResourceType): void {
    this.onResourceSelected.emit(resource);
    this.selectedResource = resource;
  }
}
