import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from "../../utils/types";

@Component({
  selector: 'app-resource-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-selector.component.html',
  styleUrls: ['./resource-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceSelectorComponent {
  @Output() onResourceSelected = new EventEmitter<Resource>();
  public selectedResource: Resource;

  public selectResource(resource: Resource): void {
    this.onResourceSelected.emit(resource);
    this.selectedResource = resource;
  }
}
