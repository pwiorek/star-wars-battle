import { inject, Pipe, PipeTransform } from '@angular/core';
import { ResourceService } from "@services/resource.service";
import { Resource } from "@utils/types";

@Pipe({
  name: 'battleResult',
  standalone: true
})
export class BattleResultPipe implements PipeTransform {
  private resourceService = inject(ResourceService);

  transform<T extends Partial<Resource>>(resource1: T, resource2: T): string {
    const winningResource = this.resourceService.getWinningResource(resource1, resource2);

    switch (winningResource) {
      case resource1: return 'Player 1 won';
      case resource2: return 'Player 2 won';
      default: return 'Draw';
    }
  }

}
