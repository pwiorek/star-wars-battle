import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from "@utils/types";
import { BattleResultPipe } from "@pipes/battle-result.pipe";

@Component({
  selector: 'app-battle-result',
  standalone: true,
  imports: [CommonModule, BattleResultPipe],
  templateUrl: './battle-result.component.html',
  styleUrls: ['./battle-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleResultComponent {
  @Input() player1Resource: Partial<Resource>;
  @Input() player2Resource: Partial<Resource>;
}
